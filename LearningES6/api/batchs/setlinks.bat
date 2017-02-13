@echo off
set DIRBASE=%~dp0..

echo Setting link for WebHost...
mklink /d "%DIRBASE%\WebHost" "%DIRBASE%\..\..\..\WebHost\Core"
mklink /d "%DIRBASE%\node_modules\webhost" "%DIRBASE%\..\..\..\WebHost\Core"
mklink /d "%DIRBASE%\..\..\..\WebHost\Core\node_modules" "%DIRBASE%\node_modules"

echo Setting link for WebHost.Api...
mklink /d "%DIRBASE%\WebHostApi" "%DIRBASE%\..\..\..\WebHost\Api"
mklink /d "%DIRBASE%\node_modules\webhost-api" "%DIRBASE%\..\..\..\WebHost\Api"
mklink /d "%DIRBASE%\..\..\..\WebHost\Api\node_modules" "%DIRBASE%\node_modules"

set DIRBASE=
echo Link's created!