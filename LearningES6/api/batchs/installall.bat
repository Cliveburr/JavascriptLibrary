@echo off
set DIRBASE=%~dp0..

echo Begin install all dependencies...

for %%A in (Core Api) do (
  cd "%DIRBASE%\..\..\..\WebHost\%%A"
  echo Install typings in WebHost\%%A...
  call typings install
)

cd "%DIRBASE%"
echo Install typings %%A...
call typings install
echo Install npm...
call npm install

cd "batchs"
call setlinks.bat

set DIRBASE=
echo Environment ready!