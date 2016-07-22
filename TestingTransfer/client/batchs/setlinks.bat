@echo off
set DIRBASE=%~dp0..\..

for %%A in (commom electron webui) do (
    echo Setting link for framework\%%A...
    mklink /d "%DIRBASE%\client\%%A" "%DIRBASE%\framework\%%A"
    mklink /d "%DIRBASE%\client\node_modules\%%A" "%DIRBASE%\framework\%%A"
)

set DIRBASE=
echo Link's created!