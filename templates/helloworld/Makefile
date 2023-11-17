install:
	bash ./scripts/install.sh

build:
	bash ./scripts/build.sh

clean:
	bash ./scripts/clean.sh

publish:
	bash ./scripts/publish.sh

.ONESHELL:
run-ui:
	cd ui
	npm run start

.ONESHELL:
run-server:
	cd server
	npm run build
	npm run serve

.ONESHELL:
run-blueprint:
	cd server
	npm run blueprint

.ONESHELL:
run-server-prod:
	cd server
	npm run build:prod
	npm run serve

.ONESHELL:
run-ui-prod:
	cd ui
	npm run build:prod
	npm run serve
