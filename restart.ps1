# restart.ps1 — Kill all dev servers on common ports and restart Ramen Don

$ports = @(3000, 3001, 3002, 3003, 3004, 3005)

Write-Host "Stopping processes on ports $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    $pids = netstat -ano | Select-String ":$port\s" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Sort-Object -Unique

    foreach ($pid in $pids) {
        if ($pid -match '^\d+$' -and $pid -ne '0') {
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "  Killed PID $pid on port $port" -ForegroundColor Red
            } catch {
                # Already gone
            }
        }
    }
}

# Also kill any stray node / next processes by name
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Killed node process PID $($_.Id)" -ForegroundColor Red
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "Starting Ramen Don dev server on 0.0.0.0:3000..." -ForegroundColor Green
Write-Host "Access on this machine:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "Access on mobile:        http://192.168.0.110:3000" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot
npx next dev -H 0.0.0.0 -p 3000
