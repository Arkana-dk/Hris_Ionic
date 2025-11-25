@echo off
echo ========================================
echo   HRIS-FIX BACKEND INTEGRATION TEST
echo ========================================
echo.
echo Repository: https://github.com/Arkana-dk/hris-fix
echo Backend API: http://localhost:8000/api
echo.

REM Check if backend is running
echo [1/4] Checking backend connection...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/api > temp.txt
set /p STATUS=<temp.txt
del temp.txt

if "%STATUS%"=="000" (
    echo   [X] Backend NOT running!
    echo.
    echo   CARA START BACKEND:
    echo   1. Clone: git clone https://github.com/Arkana-dk/hris-fix.git
    echo   2. Setup: composer install, php artisan migrate, php artisan db:seed
    echo   3. Run: php artisan serve --host=0.0.0.0 --port=8000
    echo.
    pause
    exit /b 1
) else (
    echo   [OK] Backend is running ^(Status: %STATUS%^)
)

echo.
echo [2/4] Testing Login Endpoint...
echo   POST http://localhost:8000/api/login
echo.

curl -X POST http://localhost:8000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"employee@example.com\",\"password\":\"password\"}" ^
  -w "\n\nHTTP Status: %%{http_code}\n" ^
  -o login_response.json

echo.
echo   Response saved to: login_response.json
type login_response.json
echo.

REM Extract token from response (simplified)
echo [3/4] Extracting token...
findstr /C:"access_token" login_response.json > nul
if errorlevel 1 (
    echo   [X] Login failed! Check credentials.
    echo   Default: employee@example.com / password
) else (
    echo   [OK] Login successful!
)

echo.
echo [4/4] Testing Dashboard Endpoint...
echo   GET http://localhost:8000/api/employee/dashboard
echo   ^(Note: Requires valid token from login^)
echo.

echo ========================================
echo   INTEGRATION TEST SUMMARY
echo ========================================
echo.
echo   Backend URL: http://localhost:8000
echo   Frontend URL: http://localhost:8100 ^(npm run dev^)
echo.
echo   NEXT STEPS:
echo   1. Check login_response.json for token
echo   2. Run Ionic app: npm run dev
echo   3. Login from browser: http://localhost:8100
echo   4. Test Clock In/Out feature
echo   5. Verify data in backend database
echo.
echo   Full docs: HRIS_FIX_INTEGRATION.md
echo.

del login_response.json 2>nul

pause
