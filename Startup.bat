@echo off
CALL cd "%~dp0"Frontend
CALL npm run build
CALL cd ..
CALL cd "%~dp0"backend
::CAMBIAR RUTA A DONDE TIENEN PYTHON INSTALADO, AQUI ->>>>>>>>>>>>>>>>>>
CALL "%LocalAppData%"\Programs\Python\Python310\python.exe manage.py runserver
pause