@echo off
echo Installing MongoDB Community Server...
echo.

REM Check if chocolatey is installed
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey is not installed. 
    echo Please install MongoDB manually from: https://www.mongodb.com/try/download/community
    echo Or install Chocolatey first from: https://chocolatey.org/install
    pause
    exit /b 1
)

echo Installing MongoDB via Chocolatey...
choco install mongodb -y

echo.
echo Starting MongoDB service...
net start MongoDB

echo.
echo Testing MongoDB connection...
timeout /t 3 /nobreak >nul
mongod --version

echo.
echo MongoDB installation completed!
echo You can now run: npm run test-db
pause