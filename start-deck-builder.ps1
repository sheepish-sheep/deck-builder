# This script opens two new PowerShell windows: one for the backend and one for the frontend.

# --- Start FastAPI Backend in a new window ---
$backendScript = {
    $Host.UI.RawUI.WindowTitle = 'Backend Server (FastAPI)';
    Push-Location -Path ($PSScriptRoot + '.\BackEnd');
    Write-Host 'Starting FastAPI backend (uvicorn main:app --reload)...' -ForegroundColor Green;
    uvicorn main:app --reload;
    Read-Host 'Backend server stopped. Press Enter to exit.'
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Give the backend a moment to start before launching the frontend
Start-Sleep -Seconds 3

# --- Start Node.js Frontend in a new window ---
$frontendScript = {
    $Host.UI.RawUI.WindowTitle = 'Frontend Server (Node.js)';
    Push-Location -Path $PSScriptRoot
    Write-Host 'Starting Node.js frontend (node server.js)...' -ForegroundColor Cyan;
    node server.js;
    Read-Host 'Frontend server stopped. Press Enter to exit.'
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host "✅ Started backend and frontend servers in separate windows."