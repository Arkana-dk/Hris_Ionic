@echo off
REM ========================================
REM Switch API Environment Script (Windows)
REM ========================================
REM Usage:
REM   switch-env.bat local    - Switch to localhost
REM   switch-env.bat remote   - Switch to hakunamatata.my.id

echo ========================================
echo 🔄 HRIS API Environment Switcher
echo ========================================

if "%1"=="local" (
    echo.
    echo Switching to LOCALHOST mode...
    copy /Y .env.local .env > nul
    echo ✅ Switched to LOCALHOST
    echo API URL: http://localhost:8000/api
    echo.
    echo ⚠️  Make sure Laravel backend is running:
    echo    php artisan serve
    goto end
)

if "%1"=="remote" (
    echo.
    echo Switching to REMOTE mode...
    copy /Y .env.remote .env > nul
    echo ✅ Switched to REMOTE
    echo API URL: https://hakunamatata.my.id/api
    goto end
)

echo.
echo ❌ Invalid argument!
echo.
echo Usage:
echo   switch-env.bat local   - Switch to localhost:8000
echo   switch-env.bat remote  - Switch to hakunamatata.my.id
exit /b 1

:end
echo.
echo 📝 Restart dev server for changes to take effect:
echo    npm run dev
echo ========================================
