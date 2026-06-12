from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import random
import string
from datetime import datetime
from app.database import get_db
from app.models import StudyMaterial, Student, MaterialDistribution
from pydantic import BaseModel

router = APIRouter()

class StudyMaterialCreate(BaseModel):
    title: str
    description: Optional[str] = None
    subject: str
    class_name: str
    material_type: str
    tags: Optional[str] = None

class StudyMaterialResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    subject: str
    class_name: str
    material_type: str
    upload_date: datetime
    total_downloads: int
    
    class Config:
        from_attributes = True

class DistributeRequest(BaseModel):
    material_id: int
    student_id: int
    due_date: Optional[str] = None

# In-memory storage for demo
materials_db = []
next_material_id = 1
distributions_db = []
next_dist_id = 1

@router.post("/materials", response_model=StudyMaterialResponse)
def create_material(material: StudyMaterialCreate, db: Session = Depends(get_db)):
    global next_material_id
    new_material = {
        "id": next_material_id,
        "material_id": f"MAT{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "title": material.title,
        "description": material.description,
        "subject": material.subject,
        "class_name": material.class_name,
        "material_type": material.material_type,
        "tags": material.tags,
        "upload_date": datetime.now(),
        "total_downloads": 0,
        "uploaded_by": 1
    }
    materials_db.append(new_material)
    next_material_id += 1
    return new_material

@router.get("/materials", response_model=List[StudyMaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return materials_db

@router.post("/distribute")
def distribute_material(request: DistributeRequest, db: Session = Depends(get_db)):
    global next_dist_id
    material = next((m for m in materials_db if m["id"] == request.material_id), None)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    student = db.query(Student).filter(Student.id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    distribution = {
        "id": next_dist_id,
        "material_id": request.material_id,
        "student_id": request.student_id,
        "distribution_date": datetime.now(),
        "due_date": request.due_date,
        "status": "distributed",
        "completion_percentage": 0
    }
    distributions_db.append(distribution)
    next_dist_id += 1
    
    return {"message": "Material distributed successfully", "distribution_id": distribution["id"]}

@router.post("/distribute-to-class")
def distribute_to_class(material_id: int, class_name: str, due_date: Optional[str] = None, db: Session = Depends(get_db)):
    students = db.query(Student).filter(Student.class_name == class_name).all()
    if not students:
        raise HTTPException(status_code=404, detail="No students found in this class")
    
    distributed_count = 0
    for student in students:
        global next_dist_id
        distribution = {
            "id": next_dist_id,
            "material_id": material_id,
            "student_id": student.id,
            "distribution_date": datetime.now(),
            "due_date": due_date,
            "status": "distributed",
            "completion_percentage": 0
        }
        distributions_db.append(distribution)
        next_dist_id += 1
        distributed_count += 1
    
    return {"message": f"Material distributed to {distributed_count} students in class {class_name}"}

@router.post("/distribute-bulk")
def distribute_bulk(material_id: int, student_ids: List[int], due_date: Optional[str] = None, db: Session = Depends(get_db)):
    distributed_count = 0
    for student_id in student_ids:
        student = db.query(Student).filter(Student.id == student_id).first()
        if student:
            global next_dist_id
            distribution = {
                "id": next_dist_id,
                "material_id": material_id,
                "student_id": student_id,
                "distribution_date": datetime.now(),
                "due_date": due_date,
                "status": "distributed",
                "completion_percentage": 0
            }
            distributions_db.append(distribution)
            next_dist_id += 1
            distributed_count += 1
    
    return {"message": f"Material distributed to {distributed_count} students"}

@router.get("/distribution-stats")
def get_distribution_stats(db: Session = Depends(get_db)):
    return {
        "total_distributed": len(distributions_db),
        "completed": len([d for d in distributions_db if d.get("status") == "completed"]),
        "in_progress": len([d for d in distributions_db if d.get("completion_percentage", 0) > 0 and d.get("completion_percentage", 0) < 100]),
        "average_completion_rate": 0,
        "total_accesses": 0
    }
