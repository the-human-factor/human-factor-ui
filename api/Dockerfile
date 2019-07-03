# Dev stage
FROM debian:9.9 AS dev-env

RUN apt-get update -y && \
    apt-get install -y python3-dev python3-pip postgresql-client libpq-dev && \
    update-alternatives --install /usr/local/bin/python python /usr/bin/python3.5 1 && \
    update-alternatives --install /usr/local/bin/pip pip /usr/bin/pip3 1 && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m human
USER human

WORKDIR /app

ENV PATH="/home/human/.local/bin:${PATH}"

COPY ./Pipfile* /app/

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV FLASK_APP /app/api/app.py:create_app()
ENV FLASK_SKIP_DOTENV 1
ENV GOOGLE_APPLICATION_CREDENTIALS /app/secrets/google_credentials.json

RUN pip install pipenv && pipenv install --dev

COPY . /app

# Prod stage
FROM debian:9.9 AS prod-env

RUN apt-get update -y && \
    apt-get install -y python3-dev python3-pip postgresql-client libpq-dev && \
    update-alternatives --install /usr/local/bin/python python /usr/bin/python3.5 1 && \
    update-alternatives --install /usr/local/bin/pip pip /usr/bin/pip3 1 && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m human
USER human

WORKDIR /app

ENV PATH="/home/human/.local/bin:${PATH}"

COPY ./Pipfile* /app/

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV FLASK_APP /app/api/app.py:create_app()
ENV FLASK_SKIP_DOTENV 1
ENV GOOGLE_APPLICATION_CREDENTIALS /app/secrets/google-credentials.json
ENV HOST 0.0.0.0
ENV PORT 9000

RUN pip install pipenv && pipenv install

COPY . /app

CMD ["pipenv", "run", "gunicorn", "-w", "4", "-b", "${HOST}:${PORT}", "api.wsgi:app"]
