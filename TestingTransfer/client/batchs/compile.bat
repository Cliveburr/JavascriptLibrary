cd %~dp0
cd..

call tsc

cd css
call node-sass main.sass main.css