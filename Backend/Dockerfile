# ----------------- BACKEND ------------------
FROM python:3.10 AS backend

WORKDIR /app/Backend

#Copiar requisitos
COPY requirements.txt .

# Instala los requisitos de tu proyecto
RUN pip install -r requirements.txt

# Copia el código de tu proyecto en el contenedor
COPY . .

# Exponer el puerto que utiliza tu aplicación
EXPOSE 8000

#Iniciar
CMD ["python","manage.py","runserver","0.0.0.0:8000"]