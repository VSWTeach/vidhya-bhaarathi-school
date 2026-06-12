from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
import pandas as pd
from app.database import get_db
from app.models import Student
from pydantic import BaseModel
from datetime import date
from app.api.auth import get_current_admin

router = APIRouter()

class StudentCreateExtended(BaseModel):
    # Personal Info
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    blood_group: Optional[str] = None
    religion: Optional[str] = None
    nationality: str = "Indian"
    
    # Contact Info
    email: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    
    # Academic Info
    class_name: str
    section: Optional[str] = None
    roll_number: Optional[str] = None
    admission_number: Optional[str] = None
    previous_school: Optional[str] = None
    
    # Parent Info
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    mother_name: Optional[str] = None
    mother_phone: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_occupation: Optional[str] = None
    
    # Transport & Hostel
    transport_required: bool = False
    transport_route: Optional[str] = None
    transport_fee: float = 0
    hostel_required: bool = False
    
    # Siblings
    sibling_in_school: bool = False
    sibling_names: Optional[str] = None
    
    # Emergency
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    
    # Medical
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None

@router.post("/extended")
def create_student_extended(student: StudentCreateExtended, db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Create student with all extended fields"""
    # Check if email exists
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate student ID
    import random
    import string
    student_id = f"VBPS-{date.today().year}-{random.randint(1000, 9999)}"
    
    db_student = Student(
        student_id=student_id,
        **student.dict()
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/export")
def export_students(file_format: str = "csv", db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Export students data to CSV or Excel"""
    students = db.query(Student).all()
    
    # Convert to list of dicts
    data = []
    for s in students:
        data.append({
            "Student ID": s.student_id,
            "Name": f"{s.first_name} {s.last_name}",
            "Class": s.class_name,
            "Section": s.section,
            "Parent Name": s.parent_name,
            "Phone": s.phone,
            "Email": s.email,
            "Blood Group": s.blood_group,
            "Transport Route": s.transport_route,
            "Medical Conditions": s.medical_conditions
        })
    
    if file_format == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys() if data else [])
        writer.writeheader()
        writer.writerows(data)
        return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=students.csv"})
    
    return {"data": data, "count": len(data)}

@router.post("/bulk-import")
async def bulk_import_students(file: UploadFile = File(...), db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Bulk import students from Excel/CSV"""
    contents = await file.read()
    
    # Read Excel file
    if file.filename.endswith('.xlsx'):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    imported_count = 0
    errors = []
    
    for _, row in df.iterrows():
        try:
            # Generate student ID
            import random
            student_id = f"VBPS-{date.today().year}-{random.randint(1000, 9999)}"
            
            student = Student(
                student_id=student_id,
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                email=row.get('email', ''),
                phone=str(row.get('phone', '')),
                class_name=str(row.get('class_name', '')),
                parent_name=row.get('parent_name', ''),
                parent_phone=str(row.get('parent_phone', '')),
                status='active'
            )
            db.add(student)
            imported_count += 1
        except Exception as e:
            errors.append(str(e))
    
    db.commit()
    
    return {
        "message": f"Successfully imported {imported_count} students",
        "errors": errors,
        "total": len(df)
    }
