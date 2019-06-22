# Dev stage
FROM debian:9.9 AS dev-env

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev postgresql-client libpq-dev && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.5 1 && \
    update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

COPY ./Pipfile* /app/

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV FLASK_APP /app/src/app.py

WORKDIR /app

RUN pip install pipenv && pipenv install --dev

COPY . /app

# Prod stage
FROM debian:9.9 AS prod-env

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev libpq-dev && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.5 1 && \
    update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

COPY ./Pipfile* /app/

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV FLASK_APP /app/src/app.py

WORKDIR /app

RUN pip install pipenv && pipenv install

COPY . /app

CMD ["./bin/wait-for-postgres.sh", "db", "pipenv", "run", "python", "src/app.py"]
