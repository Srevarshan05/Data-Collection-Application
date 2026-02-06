# 🚀 Deployment Guide - New System Setup

## Complete guide to deploy AIML Student Registration System on a new computer

---

## 📋 Prerequisites

### 1. Install Python 3.8+
- Download from: https://www.python.org/downloads/
- **IMPORTANT:** Check "Add Python to PATH" during installation
- Verify installation:
  ```bash
  python --version
  ```

### 2. Install PostgreSQL
- Download from: https://www.postgresql.org/download/windows/
- During installation:
  - Set password: `123456` (or remember your password)
  - Port: `5432` (default)
  - Remember the installation path

### 3. Install Git (Optional)
- Download from: https://git-scm.com/downloads
- Needed only if cloning from GitHub

---

## 🔧 Step-by-Step Setup

### Step 1: Get the Application Files

**Option A: Clone from GitHub**
```bash
git clone <your-repo-url>
cd Data-Collection-Application
```

**Option B: Copy Files**
- Copy the entire `Data-Collection-Application` folder to your new system
- Place it in a location like: `C:\Projects\Data-Collection-Application`

---

### Step 2: Setup PostgreSQL Database

#### 2.1 Open pgAdmin or psql

**Using pgAdmin:**
1. Open pgAdmin 4
2. Connect to PostgreSQL (password: `123456`)
3. Right-click on "Databases" → Create → Database
4. Database name: `college_registration`
5. Click "Save"

**Using Command Line (psql):**
```bash
# Open Command Prompt as Administrator
psql -U postgres

# Enter password: 123456

# Create database
CREATE DATABASE college_registration;

# Exit
\q
```

#### 2.2 Verify Database
```bash
psql -U postgres -d college_registration
# If it connects successfully, database is ready
\q
```

---

### Step 3: Configure the Application

#### 3.1 Navigate to Project Directory
```bash
cd C:\Projects\Data-Collection-Application
```

#### 3.2 Create .env File (Automatic)
The `setup_and_run.bat` will create this automatically, but you can create it manually:

Create a file named `.env` in the root directory with:
```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/college_registration
APP_HOST=0.0.0.0
APP_PORT=8002
MAX_UPLOAD_SIZE=524288
UPLOAD_FOLDER=uploads
REPORTS_FOLDER=reports
IMAGE_SIZE=300
IMAGE_QUALITY=70
```

**⚠️ IMPORTANT:** If your PostgreSQL password is different, update it in the `.env` file:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_registration
```

---

### Step 4: Run the Setup Script

#### 4.1 Double-click `setup_and_run.bat`

The script will automatically:
1. ✅ Check Python installation
2. ✅ Check PostgreSQL configuration
3. ✅ Create .env file
4. ✅ Create virtual environment
5. ✅ Install all dependencies
6. ✅ Create necessary directories
7. ✅ Initialize database tables
8. ✅ Start the application

#### 4.2 What You'll See
```
============================================================
AIML Student Registration & Data Management System
Setup and Run Script
============================================================

[1/8] Checking Python installation...
Python 3.x.x

[2/8] Checking PostgreSQL...
Please ensure PostgreSQL is running on port 5432
Database name: college_registration
Password: 123456

[3/8] Creating .env configuration file...
.env file created successfully!

[4/8] Creating virtual environment...
Virtual environment created successfully!

[5/8] Activating virtual environment...

[6/8] Installing dependencies...
[Installing packages...]

[7/8] Creating necessary directories...
Directories created successfully!

[8/8] Initializing database...
✅ Database tables created successfully!

============================================================
Starting the application...

Access URLs:
  - Registration: http://localhost:8002
  - Admin Dashboard: http://localhost:8002/admin

Database Configuration:
  - Host: localhost:5432
  - Database: college_registration
  - Password: 123456

Press Ctrl+C to stop the server
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8002
```

---

### Step 5: Access the Application

1. **Open your browser**
2. **Go to:** http://localhost:8002
3. **Register a student** to test
4. **Access admin:** http://localhost:8002/admin

---

## 🔍 Troubleshooting

### Issue 1: "Python is not installed or not in PATH"

**Solution:**
1. Reinstall Python
2. Check "Add Python to PATH" during installation
3. Restart Command Prompt

---

### Issue 2: "Database connection failed"

**Possible Causes & Solutions:**

**A. PostgreSQL not running**
```bash
# Check if PostgreSQL is running
# Open Services (Win + R → services.msc)
# Look for "postgresql-x64-xx" service
# If stopped, right-click → Start
```

**B. Wrong password**
```bash
# Update .env file with correct password
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/college_registration
```

**C. Database doesn't exist**
```bash
# Create database using pgAdmin or psql
psql -U postgres
CREATE DATABASE college_registration;
\q
```

**D. Wrong port**
```bash
# Check PostgreSQL port in pgAdmin
# Update .env if different from 5432
DATABASE_URL=postgresql://postgres:123456@localhost:YOUR_PORT/college_registration
```

---

### Issue 3: "Port 8002 already in use"

**Solution:**
```bash
# Option 1: Kill the process using port 8002
netstat -ano | findstr :8002
taskkill /PID <PID_NUMBER> /F

# Option 2: Use a different port
# Edit .env file:
APP_PORT=8003

# Then run:
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

---

### Issue 4: "Module not found" errors

**Solution:**
```bash
# Activate virtual environment
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

---

### Issue 5: Excel download not working

**Solution:**
```bash
# Ensure openpyxl is installed
venv\Scripts\activate
pip install openpyxl

# Create reports/temp directory
mkdir reports\temp
```

---

## 📝 Manual Setup (Alternative Method)

If `setup_and_run.bat` doesn't work, follow these manual steps:

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
```bash
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create .env File
Create `.env` with your database credentials

### 5. Create Directories
```bash
mkdir uploads
mkdir reports
mkdir reports\temp
```

### 6. Initialize Database
```bash
python init_db.py
```

### 7. Run Application
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

---

## 🌐 Network Access (LAN)

### To access from other computers on the same network:

1. **Find your IP address:**
```bash
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

2. **Allow through Windows Firewall:**
```bash
# Run as Administrator
netsh advfirewall firewall add rule name="AIML App" dir=in action=allow protocol=TCP localport=8002
```

3. **Access from other computers:**
```
http://YOUR_IP_ADDRESS:8002
Example: http://192.168.1.100:8002
```

---

## 🔐 Security Notes

### For Production Deployment:

1. **Change default password:**
   - Update PostgreSQL password
   - Update `.env` file

2. **Use environment variables:**
   - Don't commit `.env` to Git
   - Use `.env.example` as template

3. **Enable HTTPS:**
   - Use reverse proxy (nginx)
   - Get SSL certificate

4. **Restrict access:**
   - Configure firewall rules
   - Use VPN for remote access

---

## 📊 Database Backup

### Backup Database:
```bash
pg_dump -U postgres -d college_registration > backup.sql
```

### Restore Database:
```bash
psql -U postgres -d college_registration < backup.sql
```

---

## 🆘 Getting Help

### Check Logs:
- Application logs appear in the terminal
- Look for error messages in red

### Common Commands:
```bash
# Check Python version
python --version

# Check pip version
pip --version

# List installed packages
pip list

# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Test database connection
psql -U postgres -d college_registration -c "SELECT 1;"
```

---

## ✅ Verification Checklist

Before using the application, verify:

- [ ] Python 3.8+ installed
- [ ] PostgreSQL installed and running
- [ ] Database `college_registration` created
- [ ] `.env` file created with correct credentials
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database tables initialized
- [ ] Application running on port 8002
- [ ] Can access http://localhost:8002
- [ ] Can register a student
- [ ] Can access admin dashboard
- [ ] Can download Excel reports

---

## 🎉 Success!

If you can:
1. ✅ Register a student with photo
2. ✅ See the student in admin dashboard
3. ✅ Download Excel report with embedded photo

**Your system is ready for production use!**

---

## 📞 Support

For issues:
1. Check this guide's troubleshooting section
2. Review error messages in terminal
3. Check `DATABASE_FIX_GUIDE.md`
4. Verify PostgreSQL is running

---

**Last Updated:** 2024
**Application:** AIML Student Registration & Data Management System
**Version:** 1.0.0
