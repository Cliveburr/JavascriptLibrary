@echo off
cd %~dp0
cd..

echo Transpiling typescript...
call tsc

cd src
cd css
echo Transpiling sass...
call node-sass main.sass main.css

echo Done!