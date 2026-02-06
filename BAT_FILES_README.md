# 🚀 Setup Scripts Guide

## Available BAT Files

### 1. `setup_and_run.bat` (Standard Setup)
**Use this for:** Regular startup after initial setup

**What it does:**
- ✅ Checks Python installation
- ✅ Checks PostgreSQL connection
- ✅ Creates .env file (if missing)
- ✅ Creates virtual environment (if missing)
- ✅ Installs dependencies
- ✅ Creates necessary directories
- ✅ Initializes database tables
- ✅ Starts the application on port 8002

**When to use:**
- Daily startup
- After pulling code updates (if no database schema changes)
- Regular development work

**Command:**
```bash
setup_and_run.bat
```

---

### 2. `setup_and_run_with_reset.bat` (With Database Reset)
**Use this for:** First-time setup or after major updates

**What it does:**
- ✅ Everything from setup_and_run.bat
- ✅ **PLUS: Asks if you want to reset the database**
- ✅ Resets database with new schema (if you choose Yes)
- ✅ Preserves existing data (if you choose No)

**When to use:**
- **FIRST TIME** running the application
- After pulling updates with **new database fields**
- When you see database errors about missing columns
- When you want a fresh start (deletes all data)

**Command:**
```bash
setup_and_run_with_reset.bat
```

**Interactive Prompt:**
```
Do you want to RESET the database? (This will delete all existing data) [Y/N]:
```
- Type `Y` → Resets database (fresh start)
- Type `N` → Keeps existing database

---

## 🆕 Recent Updates (New Features)

The application now includes:
1. ✅ **iPad Ownership Tracking** - Yes/No field
2. ✅ **iPad MAC Address** - Conditional field with auto-formatting
3. ✅ **Signature Upload** - Browse OR camera capture
4. ✅ **Updated Admin Labels** - "1st Year - Section A" format

**⚠️ IMPORTANT:** If you're updating from an older version, you MUST reset the database to include these new fields!

---

## 📋 Quick Decision Guide

### Scenario 1: First Time Setup
```bash
setup_and_run_with_reset.bat
→ Choose Y when asked about database reset
```

### Scenario 2: Daily Startup (No Updates)
```bash
setup_and_run.bat
```

### Scenario 3: After Pulling Updates
**If README mentions database changes:**
```bash
setup_and_run_with_reset.bat
→ Choose Y to reset database
```

**If no database changes:**
```bash
setup_and_run.bat
```

### Scenario 4: Database Errors
```bash
setup_and_run_with_reset.bat
→ Choose Y to reset database
```

---

## 🔧 Manual Database Reset

If you need to reset the database manually:

```bash
# Activate virtual environment
venv\Scripts\activate

# Run reset script
python reset_db_auto.py
```

---

## 📊 Database Configuration

Both scripts use these settings:
- **Host:** localhost:5432
- **Database:** college_registration
- **Username:** postgres
- **Password:** 123456
- **Port:** 8002 (Application)

---

## 🌐 Access URLs

After running either script:
- **Registration Form:** http://localhost:8002
- **Admin Dashboard:** http://localhost:8002/admin?password=admin123

---

## ⚠️ Troubleshooting

### Error: "Python is not installed"
**Solution:** Install Python 3.8+ from https://python.org

### Error: "PostgreSQL connection failed"
**Solution:** 
1. Start PostgreSQL service
2. Verify database exists: `college_registration`
3. Check password: `123456`

### Error: "column students.has_ipad does not exist"
**Solution:** Run `setup_and_run_with_reset.bat` and choose Y

### Error: "Port 8002 already in use"
**Solution:** 
1. Close other instances
2. Or change port in `.env` file

---

## 📝 Notes

- Both scripts create the same `.env` file
- Virtual environment is shared between both scripts
- Database reset only affects data, not configuration
- Always backup important data before resetting database

---

## 🎯 Recommended Workflow

**For Development:**
1. First time: `setup_and_run_with_reset.bat` (Y)
2. Daily work: `setup_and_run.bat`
3. After updates: Check if database changed
   - Yes → `setup_and_run_with_reset.bat` (Y)
   - No → `setup_and_run.bat`

**For Production:**
1. Initial setup: `setup_and_run_with_reset.bat` (Y)
2. Regular startup: `setup_and_run.bat`
3. Updates: Backup data first, then reset if needed
