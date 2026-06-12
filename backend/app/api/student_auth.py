from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel
from app.database import get_db
from app.models import Student
import os

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = "your-super-secret-key-for-vidya-bharati-school-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

class StudentLoginRequest(BaseModel):
    username: str
    password: str

class StudentLoginResponse(BaseModel):
    access_token: str
    token_type: str
    student: dict

def create_student_token(student_id: int):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(student_id), "type": "student", "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ==================== IMPORTANT: Define get_current_student FIRST ====================
def get_current_student(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id = int(payload.get("sub"))
        if payload.get("type") != "student":
            raise HTTPException(status_code=401, detail="Invalid token type")
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=401, detail="Student not found")
        return student
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== Login Endpoint ====================
@router.post("/student/login", response_model=StudentLoginResponse)
def student_login(request: StudentLoginRequest, db: Session = Depends(get_db)):
    # Trim whitespace from username and password
    username = request.username.strip()
    password = request.password.strip()
    
    print(f"📱 Login attempt - Username: '{username}', Password: '{password}'")
    
    # Try to find student by student_id, roll_number, or email
    student = db.query(Student).filter(
        (Student.student_id == username) | 
        (Student.roll_number == username) |
        (Student.email == username)
    ).first()
    
    if not student:
        print(f"❌ Student not found with username: {username}")
        # Get list of available student IDs for helpful error message
        available_ids = [s.student_id for s in db.query(Student.student_id).all()]
        raise HTTPException(
            status_code=401, 
            detail=f"Student not found. Available IDs: {available_ids}"
        )
    
    print(f"✅ Found student: {student.student_id} - {student.first_name} {student.last_name}")
    print(f"   Roll number: {student.roll_number}")
    
    # Check password - accept 'student123' or roll number
    if password == "student123" or password == student.roll_number:
        token = create_student_token(student.id)
        print(f"✅ Login successful!")
        
        return StudentLoginResponse(
            access_token=token,
            token_type="bearer",
            student={
                "id": student.id,
                "student_id": student.student_id,
                "name": f"{student.first_name} {student.last_name}",
                "class_name": student.class_name,
                "section": student.section,
                "email": student.email,
                "roll_number": student.roll_number
            }
        )
    
    print(f"❌ Password mismatch for: {student.student_id}")
    raise HTTPException(status_code=401, detail="Invalid password. Try 'student123' or your roll number")

# ==================== Student Materials Endpoints ====================
@router.get("/student/materials")
def get_student_materials(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    from app.models import MaterialDistribution, StudyMaterial
    
    distributions = db.query(MaterialDistribution).filter(
        MaterialDistribution.student_id == current_student.id
    ).all()
    
    materials = []
    for dist in distributions:
        material = db.query(StudyMaterial).filter(StudyMaterial.id == dist.material_id).first()
        if material:
            materials.append({
                "id": material.id,
                "material_id": material.material_id,
                "title": material.title,
                "description": material.description,
                "subject": material.subject,
                "material_type": material.material_type,
                "file_url": material.file_url,
                "assigned_date": dist.distribution_date,
                "due_date": dist.due_date,
                "status": dist.status,
                "completion_percentage": dist.completion_percentage
            })
    
    return materials

@router.put("/student/materials/{material_id}/progress")
def update_material_progress(
    material_id: int,
    completion_percentage: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    from app.models import MaterialDistribution
    
    distribution = db.query(MaterialDistribution).filter(
        MaterialDistribution.material_id == material_id,
        MaterialDistribution.student_id == current_student.id
    ).first()
    
    if not distribution:
        raise HTTPException(status_code=404, detail="Material not assigned to you")
    
    distribution.completion_percentage = completion_percentage
    distribution.last_accessed = datetime.now()
    
    if completion_percentage >= 100:
        distribution.status = "completed"
    else:
        distribution.status = "in_progress"
    
    db.commit()
    
    return {
        "message": "Progress updated",
        "completion_percentage": completion_percentage,
        "status": distribution.status
    }

@router.get("/student/info")
def get_student_info(current_student: Student = Depends(get_current_student)):
    return {
        "id": current_student.id,
        "student_id": current_student.student_id,
        "name": f"{current_student.first_name} {current_student.last_name}",
        "class": current_student.class_name,
        "section": current_student.section,
        "email": current_student.email,
        "phone": current_student.phone
    }
