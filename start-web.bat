@echo off
echo Starting LDMovies Website...
echo.

cd /d "%~dp0frontend"

echo [1/2] Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo [2/2] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --config config.yml run"

echo.
echo ========================================
echo Website is starting...
echo Frontend: http://localhost:3000
echo Public URL: https://ldmovies.mydrpet.io.vn
echo ========================================
echo.
echo Press any key to exit (servers will keep running)...
pause > nul
