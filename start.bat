@echo off
echo Starting Vidya Bharati School ERP...
cd backend
start "Backend Server" cmd /k "venv\Scripts\activate && python init_db.py && uvicorn app.main:app --reload --port 8000"
cd ../frontend
start "Frontend Server" cmd /k "npm start"
echo.
echo ========================================
echo Application Started!
echo ========================================
echo Website: http://localhost:3000
echo Admin: http://localhost:3000/admin/login
echo Admin Credentials: admin / admin123
echo API Docs: http://localhost:8000/docs
echo ========================================
