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
echo IMPORTANT NOTE:
echo If you updated the application and see database errors,
echo run: setup_and_run_with_reset.bat (includes database reset)
echo ============================================================
echo.

echo ============================================================
echo Starting the application...
echo.
echo Access URLs:
echo   - Local: http://localhost:8002
echo   - Admin: http://localhost:8002/admin?password=admin123
echo.
echo Database Configuration:
echo   - Host: localhost:5432
echo   - Database: college_registration
echo   - Password: 123456
echo.
echo NEW FEATURES:
echo   - iPad ownership tracking
echo   - iPad MAC address field
echo   - Signature upload with camera capture
echo   - Updated admin dashboard labels
echo.
echo ============================================================
echo.

REM Start the application in a new window
start "FastAPI Server" cmd /k "venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Check if ngrok is installed
where ngrok >nul 2>&1
if errorlevel 1 (
    echo.
    echo [WARNING] Ngrok is not installed or not in PATH
    echo Please install ngrok from: https://ngrok.com/download
    echo.
    echo Application is running locally at: http://localhost:8002
    echo.
    pause
    exit /b 0
)

REM Start ngrok tunnel
echo.
echo Starting Ngrok tunnel on port 8002...
echo.
start "Ngrok Tunnel" cmd /k "ngrok http 8002"

echo.
echo ============================================================
echo APPLICATION STARTED SUCCESSFULLY!
echo ============================================================
echo.
echo Local Access:
echo   - http://localhost:8002
echo   - http://localhost:8002/admin?password=admin123
echo.
echo Public Access:
echo   - Check the Ngrok window for your public URL
echo   - It will look like: https://xxxx-xx-xx-xx-xx.ngrok-free.app
echo.
echo Both windows will remain open:
echo   1. FastAPI Server (running the application)
echo   2. Ngrok Tunnel (providing public URL)
echo.
echo To stop: Close both windows or press Ctrl+C in each
echo ============================================================
echo.
pause
