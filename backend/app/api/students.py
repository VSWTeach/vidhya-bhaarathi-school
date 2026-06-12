from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import random
import string
from app.database import get_db
from app.models import Student
from app.schemas import StudentCreate, StudentResponse

router = APIRouter()

def generate_student_id():
    return f"SCH-2024-{''.join(random.choices(string.digits, k=4))}"

@router.post("/", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = Student(
        student_id=generate_student_id(),
        **student.dict()
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()
