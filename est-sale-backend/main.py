from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.cqlengine import connection
from typing import Optional
import httpx
import json
import os

app = FastAPI()

# Configuration from environment
KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "ent-realm")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "ent-client")
CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "cassandra")
CASSANDRA_KEYSPACE = os.getenv("CASSANDRA_KEYSPACE", "est_keyspace")

# Keycloak endpoints
KEYCLOAK_JWKS_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"
KEYCLOAK_TOKEN_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
KEYCLOAK_AUTH_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth"

# OAuth2 scheme
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=KEYCLOAK_AUTH_URL,
    tokenUrl=KEYCLOAK_TOKEN_URL,
)

# Cassandra connection
auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
cluster = Cluster([CASSANDRA_HOST], auth_provider=auth_provider)
session = cluster.connect()

# Create keyspace if not exists
session.execute(f"""
    CREATE KEYSPACE IF NOT EXISTS {CASSANDRA_KEYSPACE}
    WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
""")
session.set_keyspace(CASSANDRA_KEYSPACE)

# Models
class User(BaseModel):
    id: str
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    roles: list[str] = []

class TokenData(BaseModel):
    username: Optional[str] = None

# Cache for JWKS
jwks_cache = None

async def get_jwks():
    global jwks_cache
    if jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(KEYCLOAK_JWKS_URL)
            jwks_cache = response.json()
    return jwks_cache

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        jwks = await get_jwks()
        public_key = jwt.get_public_key(jwks["keys"][0])
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=KEYCLOAK_CLIENT_ID,
            options={"verify_aud": True}
        )
        username: str = payload.get("preferred_username")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # Get user info from Keycloak
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {token}"}
        userinfo = await client.get(
            f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/userinfo",
            headers=headers
        )
        user_data = userinfo.json()
    
    # Store/update user in Cassandra
    session.execute(
        """
        INSERT INTO users (id, username, email, first_name, last_name, roles)
        VALUES (%s, %s, %s, %s, %s, %s)
        IF NOT EXISTS
        """,
        (
            payload.get("sub"),
            user_data.get("preferred_username"),
            user_data.get("email"),
            user_data.get("given_name"),
            user_data.get("family_name"),
            payload.get("realm_access", {}).get("roles", [])
        )
    )
    
    return User(
        id=payload.get("sub"),
        username=user_data.get("preferred_username"),
        email=user_data.get("email"),
        first_name=user_data.get("given_name"),
        last_name=user_data.get("family_name"),
        roles=payload.get("realm_access", {}).get("roles", [])
    )

@app.get("/login")
async def login():
    """Redirect to Keycloak login"""
    return {
        "login_url": (
            f"{KEYCLOAK_AUTH_URL}?"
            f"client_id={KEYCLOAK_CLIENT_ID}&"
            "response_type=code&"
            "scope=openid profile email&"
            "redirect_uri=http://localhost:8000/callback"
        )
    }

@app.get("/callback")
async def callback(code: str):
    """Exchange authorization code for tokens"""
    async with httpx.AsyncClient() as client:
        data = {
            "grant_type": "authorization_code",
            "client_id": KEYCLOAK_CLIENT_ID,
            "code": code,
            "redirect_uri": "http://localhost:8000/callback"
        }
        response = await client.post(KEYCLOAK_TOKEN_URL, data=data)
        return response.json()

@app.get("/userinfo")
async def read_user_info(current_user: User = Depends(get_current_user)):
    """Example protected endpoint"""
    return current_user

@app.get("/public")
async def public_info():
    """Example public endpoint"""
    return {"message": "Public information available to all users"}