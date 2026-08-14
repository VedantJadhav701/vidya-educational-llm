@echo off
title Vidya 1.7B - Local AI Assistant
color 0A

echo.
echo  ============================================================
echo   Vidya 1.7B - Local AI Learning Assistant
echo  ============================================================
echo.
echo   Starting Vidya on your NVIDIA GPU...
echo.

:: Initialize conda in this shell session
call "C:\Users\HP\miniconda3\Scripts\activate.bat" "C:\Users\HP\miniconda3"

:: Activate the thermo_agent environment
call conda activate thermo_agent
if errorlevel 1 (
    echo [ERROR] Could not activate conda environment 'thermo_agent'.
    pause
    exit /b 1
)

:: Navigate to the local app directory
cd /d "%~dp0"

:: Set environment variables
set KMP_DUPLICATE_LIB_OK=TRUE
set PYTHONIOENCODING=utf-8

:: Run the app
echo   Launching Vidya... (browser will open automatically)
echo   Press Ctrl+C to stop.
echo.
python app.py

:: If python exits unexpectedly
echo.
echo   Vidya has stopped.
pause
