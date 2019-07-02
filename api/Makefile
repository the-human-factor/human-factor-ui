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
	docker-compose exec db psql -U human_factor_user human_factor

.PHONY: migrate
migrate:
	docker-compose exec api pipenv run flask db upgrade

.PHONY: db-reset
db-reset:
	docker-compose build api && docker-compose down && docker volume rm human-factor-api_devdb && docker-compose up --force-recreate -d api
