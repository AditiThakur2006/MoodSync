@echo off
title MoodSync Server
echo.
echo   ========================================
echo       MoodSync - Starting Server...
echo   ========================================
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo   Installing dependencies...
    npm install
    echo.
)

:: Open browser after a short delay
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the server
echo   Server starting at http://localhost:3000
echo   Close this window to stop the server.
echo.
node server.js
