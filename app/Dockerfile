FROM python:3.10-slim

WORKDIR /backend

<<<<<<< HEAD
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
=======
# Instala dependências de sistema para o PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copia dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da pasta 'app' para o container
COPY . .

# Comando para rodar (ajustado para o seu main.py)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
