@echo off
cd /d %~dp0
REM Start the frontend server from the project root
start cmd /k "node server.js"
