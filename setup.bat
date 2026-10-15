@echo off
setlocal

title KeMeNJI Browser Setup

echo.
echo ==========================================
echo       KeMeNJI Browser Setup
echo ==========================================
echo.

REM Move into the directory containing this script.
cd /d "%~dp0"

REM Check for Node.js.
where node >nul 2>&1

if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo.
    echo Download Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check for npm.
where npm >nul 2>&1

if errorlevel 1 (
    echo ERROR: npm was not found.
    echo Please reinstall Node.js with npm included.
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo npm version:
call npm --version

if errorlevel 1 (
    echo.
    echo ERROR: npm could not run.
    pause
    exit /b 1
)

REM Check for package.json.
if not exist "package.json" (
    echo.
    echo ERROR: package.json was not found.
    echo Place this script in the project root.
    echo.
    pause
    exit /b 1
)

echo.
echo Installing KeMeNJI Browser dependencies...
echo.

call npm.cmd install

if errorlevel 1 (
    echo.
    echo ERROR: Dependency installation failed.
    echo Check your internet connection and npm output.
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo       Setup completed successfully!
echo ==========================================
echo.
echo To launch the browser, run start.bat
echo or use npm.cmd start if your package.json
echo defines the appropriate start script.
echo.

pause
exit /b 0