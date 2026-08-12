@echo off
chcp 65001 > nul
echo ========================================================
echo   Shop&Savor (숍 앤 세이버) 개발 서버를 시작합니다...
echo ========================================================
echo.
echo  1. 로컬 웹 서버 구동 중 (http://localhost:8080)
echo  2. 잠시 후 웹 브라우저가 자동으로 열립니다.
echo.

start http://localhost:8080
npx -y http-server -p 8080
pause
