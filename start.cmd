@echo off
title UMF Expertenstandards
echo ======================================================
echo    Starting UMF Expertenstandards Application...
echo ======================================================

:: Check if agy-node or node is available
where agy-node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using agy-node runtime...
    start http://localhost:3000
    agy-node server.js
    goto end
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using Node.js runtime...
    start http://localhost:3000
    node server.js
    goto end
)

:: Fallback if neither node runner is in PATH: try Antigravity direct node runner
if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    echo Using Antigravity bundled Node runtime...
    start http://localhost:3000
    "%APPDATA%\Antigravity\bin\agy-node.cmd" server.js
    goto end
)

:: Direct fallback: open index.html directly
echo Notice: Node runtime not found in PATH. Opening index.html directly in your default browser...
start index.html

:end
pause
