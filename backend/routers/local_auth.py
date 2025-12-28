from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, Base, engine
from models.local_user import LocalUser
from security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

# Create database tables
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/auth", tags=["local_auth"])

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(LocalUser).filter(LocalUser.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = LocalUser(
        email=user.email, 
        username=user.username, 
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(LocalUser).filter(LocalUser.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email, "type": "local"}, expires_delta=access_token_expires
    )
    
    # Return user data compatible with GitHub user shape for frontend compatibility
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "login": user.username,
            "id": user.id,
            "avatar_url": user.avatar_url,
            "name": user.username,
            "email": user.email
        }
    }
