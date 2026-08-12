# Shop&Savor One-Click PowerShell Launcher Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Shop&Savor (숍 앤 세이버) 서버를 실행합니다..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 웹 브라우저 (http://localhost:8080) 열기..." -ForegroundColor Yellow
Start-Process "http://localhost:8080"

Write-Host "2. npx http-server 서버 구동 중..." -ForegroundColor Green
npx -y http-server -p 8080
