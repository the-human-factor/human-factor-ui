.PHONY: console
console:
	docker-compose exec api pipenv run flask shell


.PHONY: shell
shell:
	docker-compose exec api bash

.PHONY: test
test:
	docker-compose exec api pipenv run pytest

.PHONY: psql
psql:
	docker-compose exec db psql -U postgres human_factor

.PHONY: migrate
migrate:
	docker-compose exec api pipenv run flask db upgrade

.PHONY: db-reset
db-reset:
	docker-compose build api && docker-compose down && docker volume rm human-factor-api_devdb && docker-compose up --force-recreate -d api

.PHONY: db-reset-all
db-reset-all:
	docker-compose build api && docker-compose down && docker volume rm human-factor-api_devdb && docker-compose up --force-recreate -d api

.PHONY: recreate-schema
recreate-schema: db-reset-all
	rm -f migrations/versions/*
	docker-compose exec api pipenv run flask db migrate && docker-compose exec api pipenv run flask db upgrade
