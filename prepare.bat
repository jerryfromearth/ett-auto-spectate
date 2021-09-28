@ECHO OFF
echo Installing dependencies in the local folder...
call npm install
if %ERRORLEVEL% EQU 0 (echo All done.) else (echo Some error has happened...)
pause