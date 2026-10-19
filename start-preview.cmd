@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required for this preview server.
  pause
  exit /b 1
)
echo Open http://127.0.0.1:4173 in your browser after the Local message.
echo Press Ctrl+C in this window to stop the local preview.
node scripts/serve.mjs
if errorlevel 1 pause
