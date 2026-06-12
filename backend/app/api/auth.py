from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from app.database import get_db
from app.models import Admin
from app.schemas import AdminLogin, TokenResponse

router = APIRouter()

SECRET_KEY = "your-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=TokenResponse)
def login(admin_login: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == admin_login.username).first()
    if not admin or admin_login.password != "admin123":
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": str(admin.id)})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        admin={"id": admin.id, "username": admin.username, "email": admin.email, "full_name": admin.full_name}
    )
