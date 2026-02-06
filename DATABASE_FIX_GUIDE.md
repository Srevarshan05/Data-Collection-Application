# 🔧 Database Connection Fix Guide

## Problem
Error: `password authentication failed for user "postgres"`

This means the PostgreSQL password in your `.env` file doesn't match your actual PostgreSQL password.

---

## Solution

### Step 1: Find Your PostgreSQL Password

**Option A: If you remember your password**
- Use that password in Step 2

**Option B: If you forgot your password**
- Open **pgAdmin** (PostgreSQL GUI tool)
- Right-click on your PostgreSQL server
- Select "Properties" → "Connection"
- You can reset the password here

**Option C: Reset PostgreSQL Password (Windows)**
1. Open Command Prompt as Administrator
2. Run:
   ```bash
   psql -U postgres
   ```
3. If it asks for password and you don't know it, you need to edit `pg_hba.conf`:
   - Find file: `C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf`
   - Change `md5` to `trust` temporarily
   - Restart PostgreSQL service
   - Connect without password
   - Reset password:
     ```sql
     ALTER USER postgres PASSWORD 'your_new_password';
     ```
   - Change `trust` back to `md5` in `pg_hba.conf`
   - Restart PostgreSQL service

---

### Step 2: Update .env File

1. **Open the `.env` file** in the root directory of your project

2. **Find this line:**
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/college_registration
   ```

3. **Replace `your_password` with your actual PostgreSQL password**

   Examples:
   ```
   # If your password is 'admin'
   DATABASE_URL=postgresql://postgres:admin@localhost:5432/college_registration

   # If your password is 'postgres123'
   DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/college_registration

   # If your password is 'mypassword'
   DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/college_registration
   ```

4. **Save the file**

---

### Step 3: Test the Connection

**Test 1: Using psql command**
```bash
psql -U postgres -d college_registration
```
- Enter your password when prompted
- If it connects successfully, your password is correct!

**Test 2: Using Python**
```bash
python init_db.py
```
- Should show: "✅ Database setup completed successfully!"

---

### Step 4: Restart the Application

1. **Stop the current server** (Press `Ctrl+C` in the terminal)

2. **Restart the application:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001
   ```

3. **Check if it starts successfully:**
   - Look for: "✅ Application started successfully!"
   - No database errors should appear

---

### Step 5: Verify Everything Works

1. **Open browser:** http://localhost:8001

2. **Test registration:**
   - Fill in student details
   - Upload or capture a photo
   - Click "Upload" button
   - Should redirect to success page

---

## Common PostgreSQL Passwords

Try these common default passwords:
- `postgres`
- `admin`
- `password`
- `root`
- `12345`

---

## Still Having Issues?

### Check PostgreSQL Service is Running

**Windows:**
1. Press `Win + R`
2. Type `services.msc`
3. Find "PostgreSQL" service
4. Make sure it's "Running"
5. If not, right-click → Start

**Check PostgreSQL Port:**
```bash
netstat -an | findstr 5432
```
- Should show PostgreSQL listening on port 5432

---

## Alternative: Use Different Database User

If you can't fix the `postgres` user password, create a new user:

1. **Connect to PostgreSQL as superuser**

2. **Create new user:**
   ```sql
   CREATE USER myuser WITH PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE college_registration TO myuser;
   ```

3. **Update .env file:**
   ```
   DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/college_registration
   ```

---

## Quick Fix Summary

```bash
# 1. Edit .env file
# Replace: DATABASE_URL=postgresql://postgres:your_password@localhost:5432/college_registration
# With your actual password

# 2. Test connection
psql -U postgres -d college_registration

# 3. Restart application
uvicorn app.main:app --host 0.0.0.0 --port 8001

# 4. Test in browser
# Open: http://localhost:8001
```

---

## Need More Help?

If you're still stuck:
1. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\<version>\data\log\`
2. Verify database exists: `psql -U postgres -l`
3. Check if you can connect with pgAdmin
4. Make sure PostgreSQL service is running

---

**After fixing, the application should work perfectly!** ✅
