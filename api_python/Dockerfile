FROM python:3.14-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar librerías de MariaDB y Poetry
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar Poetry
ENV POETRY_VERSION=2.4.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false
ENV PATH="$POETRY_HOME/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 -

# Copiar archivos de configuración de dependencias
COPY pyproject.toml poetry.lock* ./

# Instalar dependencias del proyecto (sin entorno virtual, directo al contenedor)
RUN poetry install --no-interaction --no-ansi --no-root

# Copiar el resto del código
COPY . .

EXPOSE 8000

# Arrancamos con tu archivo api.py
CMD ["python", "api.py"]
