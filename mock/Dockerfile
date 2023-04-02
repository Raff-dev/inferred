FROM python:3.10-slim-buster

WORKDIR /app/

RUN pip install --upgrade pip && \
    pip install poetry && \
    poetry config virtualenvs.create false --local

COPY ./pyproject.toml ./poetry.lock* /app/

RUN poetry install

ADD . /app/

EXPOSE 8000
