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
	docker-compose exec db psql -U human_factors_user human_factors
