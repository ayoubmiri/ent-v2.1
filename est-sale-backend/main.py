from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from jose.utils import base64url_decode
from pydantic import BaseModel
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from typing import Optional
import httpx
import os
import json
import logging
import time
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

app = FastAPI()

# Environment variables
KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "ent-realm")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "ent-client")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "secret")
CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "cassandra")
CASSANDRA_KEYSPACE = os.getenv("CASSANDRA_KEYSPACE", "est_keyspace")

KEYCLOAK_JWKS_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"
KEYCLOAK_TOKEN_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
KEYCLOAK_AUTH_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth"

# OAuth2 setup
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=KEYCLOAK_AUTH_URL,
    tokenUrl=KEYCLOAK_TOKEN_URL,
)

# Cassandra connection
auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
cluster = Cluster([CASSANDRA_HOST], auth_provider=auth_provider)
session = cluster.connect()

# Create keyspace and table if they do not exist
session.execute(f"""
    CREATE KEYSPACE IF NOT EXISTS {CASSANDRA_KEYSPACE}
    WITH replication = {{'class': 'SimpleStrategy', 'replication_factor': 1}}
""")
session.set_keyspace(CASSANDRA_KEYSPACE)

session.execute("""
CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    username text,
    email text,
    first_name text,
    last_name text,
    roles list<text>
)
""")

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

# JWKS cache with expiration
CACHE_EXPIRATION_TIME = 3600  # Cache expires after 1 hour
jwks_cache = None

async def get_jwks():
    global jwks_cache
    if jwks_cache is None or time.time() - jwks_cache['timestamp'] > CACHE_EXPIRATION_TIME:
        async with httpx.AsyncClient() as client:
            response = await client.get(KEYCLOAK_JWKS_URL)
            response.raise_for_status()
            jwks_cache = {
                "keys": response.json(),
                "timestamp": time.time()  # Store timestamp to track cache age
            }
    return jwks_cache["keys"]

def construct_rsa_public_key(jwk):
    e = int.from_bytes(base64url_decode(jwk["e"]), "big")
    n = int.from_bytes(base64url_decode(jwk["n"]), "big")
    public_numbers = rsa.RSAPublicNumbers(e, n)
    key = public_numbers.public_key(default_backend())
    return key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Decode JWT token
        jwks = await get_jwks()
        public_key_pem = construct_rsa_public_key(jwks["keys"][0])
        payload = jwt.decode(
            token,
            public_key_pem,
            algorithms=["RS256"],
            audience=KEYCLOAK_CLIENT_ID,
            options={"verify_aud": True}
        )
        username: str = payload.get("preferred_username")
        if username is None:
            raise HTTPException(status_code=401, detail="No username in token")

        # Fetch user info from Keycloak
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {token}"}
            userinfo = await client.get(
                f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/userinfo",
                headers=headers
            )
            userinfo.raise_for_status()
            user_data = userinfo.json()

        # Check if the user already exists in the database
        existing_user = get_user_by_id(payload.get("sub"))
        if not existing_user:
            # Insert the user into the Cassandra database
            session.execute("""
            INSERT INTO users (id, username, email, first_name, last_name, roles)
            VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                payload.get("sub"),
                user_data.get("preferred_username"),
                user_data.get("email"),
                user_data.get("given_name"),
                user_data.get("family_name"),
                payload.get("realm_access", {}).get("roles", [])
            ))

        # Return the user model
        return User(
            id=payload.get("sub"),
            username=user_data.get("preferred_username"),
            email=user_data.get("email"),
            first_name=user_data.get("given_name"),
            last_name=user_data.get("family_name"),
            roles=payload.get("realm_access", {}).get("roles", [])
        )

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token decode error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

def get_user_by_id(user_id: str):
    result = session.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    return result.one()

@app.get("/login")
async def login():
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
    async with httpx.AsyncClient() as client:
        data = {
            "grant_type": "authorization_code",
            "client_id": KEYCLOAK_CLIENT_ID,
            "client_secret": KEYCLOAK_CLIENT_SECRET,
            "code": code,
            "redirect_uri": "http://localhost:8000/callback"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = await client.post(KEYCLOAK_TOKEN_URL, data=data, headers=headers)
        response.raise_for_status()
        return response.json()

@app.get("/userinfo")
async def read_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/public")
async def public_info():
    return {"message": "Public information available to all users"}
