from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_db
from sqlalchemy.orm import Session
from app.api import auth, students, dashboard
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vidya Bharati School API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Student Login Request Model
class StudentLoginRequest(BaseModel):
    username: str
    password: str

# Student Login Endpoint
@app.post("/api/auth/student/login")
def student_login(request: StudentLoginRequest, db: Session = Depends(get_db)):
    from app.models import Student
    
    print(f"📱 Student login: username={request.username}, password={request.password}")
    
    # Try to find existing student
    student = db.query(Student).filter(
        (Student.student_id == request.username) | 
        (Student.roll_number == request.username) |
        (Student.email == request.username)
    ).first()
    
    # If no student found, check if we need to create one
    if not student:
        print("📝 Student not found, checking if we can create demo...")
        
        # Check if demo student already exists by email
        existing_demo = db.query(Student).filter(Student.email == "demo@student.com").first()
        
        if existing_demo:
            student = existing_demo
            print(f"✅ Using existing demo student: {student.student_id}")
        else:
            # Create new demo student only if email doesn't exist
            print("📝 Creating new demo student...")
            demo_student = Student(
                student_id="DEMO-2024-001",
                first_name="Demo",
                last_name="Student",
                email="demo@student.com",
                phone="9999999999",
                class_name="10",
                section="A",
                roll_number="2024001",
                parent_name="Demo Parent",
                parent_phone="9999999998",
                status="active"
            )
            db.add(demo_student)
            db.commit()
            db.refresh(demo_student)
            student = demo_student
            print(f"✅ New demo student created: {student.student_id}")
    
    # Verify password
    if request.password == "student123" or request.password == student.roll_number:
        SECRET_KEY = "your-secret-key-2024"
        ALGORITHM = "HS256"
        expire = datetime.utcnow() + timedelta(minutes=480)
        token = jwt.encode({"sub": str(student.id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
        
        print(f"✅ Login successful for: {student.first_name} {student.last_name}")
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "student": {
                "id": student.id,
                "student_id": student.student_id,
                "name": f"{student.first_name} {student.last_name}",
                "class_name": student.class_name,
                "section": student.section,
                "email": student.email,
                "roll_number": student.roll_number
            }
        }
    
    print(f"❌ Invalid password for: {request.username}")
    raise HTTPException(status_code=401, detail="Invalid password. Try 'student123'")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Admin Authentication"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"message": "Vidya Bharati School API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
