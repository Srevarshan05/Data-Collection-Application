@echo off
echo ============================================================
echo AIML Student Registration ^& Data Management System
echo Setup and Run Script
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo [1/8] Checking Python installation...
python --version
echo.

REM Check if PostgreSQL is running
echo [2/8] Checking PostgreSQL...
echo Please ensure PostgreSQL is running on port 5432
echo Database name: college_registration
echo Password: 123456
echo.
timeout /t 3 >nul

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [3/8] Creating .env configuration file...
    (
        echo DATABASE_URL=postgresql://postgres:123456@localhost:5432/college_registration
        echo APP_HOST=0.0.0.0
        echo APP_PORT=8002
        echo MAX_UPLOAD_SIZE=524288
        echo UPLOAD_FOLDER=uploads
        echo REPORTS_FOLDER=reports
        echo IMAGE_SIZE=300
        echo IMAGE_QUALITY=70
    ) > .env
    echo .env file created successfully!
) else (
    echo [3/8] .env file already exists
)
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo [4/8] Creating virtual environment...
    python -m venv venv
    echo Virtual environment created successfully!
) else (
    echo [4/8] Virtual environment already exists
)
echo.

REM Activate virtual environment
echo [5/8] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install dependencies
echo [6/8] Installing dependencies...
pip install -r requirements.txt
echo.

REM Create necessary directories
echo [7/8] Creating necessary directories...
if not exist "uploads" mkdir uploads
if not exist "reports" mkdir reports
if not exist "reports\temp" mkdir reports\temp
if not exist "app\static\css" mkdir app\static\css
if not exist "app\static\js" mkdir app\static\js
echo Directories created successfully!
echo.

REM Initialize database
echo [8/8] Initializing database...
python init_db.py
echo.

echo ============================================================
echo Starting the application...
echo.
echo Access URLs:
echo   - Registration: http://localhost:8002
echo   - Admin Dashboard: http://localhost:8002/admin
echo.
echo Database Configuration:
echo   - Host: localhost:5432
echo   - Database: college_registration
echo   - Password: 123456
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

REM Run the application
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload

pause
