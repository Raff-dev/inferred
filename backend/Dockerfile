FROM python:3.11-slim-buster

WORKDIR /app/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false --local

COPY ./pyproject.toml ./poetry.lock* /app/

RUN poetry install

ADD . /app/

EXPOSE 8000
