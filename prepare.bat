@ECHO OFF
echo Installing dependencies...
call pip install -r requirements.txt
if %ERRORLEVEL% EQU 0 (echo All done.) else (echo Some error has happened...)
pause