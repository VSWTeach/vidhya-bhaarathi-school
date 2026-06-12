from app.database import engine, Base
from app.models import Admin
from sqlalchemy.orm import sessionmaker

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    Session = sessionmaker(bind=engine)
    db = Session()
    
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin:
        print("Creating admin user...")
        admin_user = Admin(
            username="admin",
            email="admin@school.com",
            password_hash="admin123",
            full_name="System Administrator"
        )
        db.add(admin_user)
        db.commit()
        print("✅ Admin created: admin / admin123")
    else:
        print("✅ Admin already exists")
    
    db.close()
    print("✅ Database setup complete!")

if __name__ == "__main__":
    init_db()
