@echo off
echo ========================================
echo   HRIS Mobile - Dev Mode (CORS Bypass)
echo ========================================
echo.
echo WARNING: This will open Chrome with security disabled!
echo ONLY use for development testing.
echo DO NOT browse other websites with this window!
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Closing all Chrome instances...
taskkill /F /IM chrome.exe 2>nul

echo.
echo Starting Chrome with CORS disabled...
echo Opening: http://localhost:5173
echo.

:: Create temp directory if not exists
if not exist "C:\temp\chrome_dev" mkdir "C:\temp\chrome_dev"

:: Start Chrome with security disabled
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir="C:\temp\chrome_dev" http://localhost:5173

echo.
echo ========================================
echo   Chrome started in DEV mode!
echo ========================================
echo.
echo You can now test login with REAL API:
echo   1. Backend: hakunamatata.my.id
echo   2. CORS: BYPASSED (local only)
echo   3. Use valid credentials from admin
echo.
echo When done, close Chrome and restart normally.
echo.
pause
