from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import httpx
import os

app = FastAPI()

# Keycloak configuration
KEYCLOAK_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080")
REALM = os.getenv("KEYCLOAK_REALM", "mon-realm")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "react-client")
JWKS_URL = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"

# Cassandra configuration
auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
cluster = Cluster(['cassandra'], auth_provider=auth_provider)
session = cluster.connect()

# Create keyspace and table if not exists
session.execute("""
    CREATE KEYSPACE IF NOT EXISTS est_metadata 
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
""")
session.set_keyspace('est_metadata')
session.execute("""
    CREATE TABLE IF NOT EXISTS user_metadata (
        user_id text PRIMARY KEY,
        preferences map<text, text>,
        last_access timestamp
    )
""")

# OAuth2 scheme
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/auth",
    tokenUrl=f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token"
)

async def get_jwks():
    async with httpx.AsyncClient() as client:
        response = await client.get(JWKS_URL)
        return response.json()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        jwks = await get_jwks()
        public_key = jwt.get_public_key(jwks["keys"][0])
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            options={"verify_aud": True}
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/api/user/metadata")
async def get_user_metadata(user: dict = Depends(get_current_user)):
    user_id = user.get("sub")
    row = session.execute(
        "SELECT preferences, last_access FROM user_metadata WHERE user_id = %s",
        (user_id,)
    ).one()
    
    return {
        "user_id": user_id,
        "preferences": row.preferences if row else {},
        "last_access": row.last_access if row else None
    }

@app.post("/api/user/metadata")
async def update_user_metadata(
    preferences: dict,
    user: dict = Depends(get_current_user)
):
    user_id = user.get("sub")
    session.execute(
        """
        INSERT INTO user_metadata (user_id, preferences, last_access)
        VALUES (%s, %s, toTimestamp(now()))
        """,
        (user_id, preferences)
    )
    return {"status": "success"}