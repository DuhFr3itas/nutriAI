FROM python:3.10-slim

WORKDIR /backend

# Instala dependências de sistema para o PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copia dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da pasta 'app' para o container
COPY . .

# Comando para rodar (ajustado para o seu main.py)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]