from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    class_name: str
    section: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    student_id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    admin: dict

class DashboardStats(BaseModel):
    total_students: int
    fees_collected: float
    fees_pending: float
    active_students: int
