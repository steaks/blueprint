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
run-server-prod: ## Run the server in production mode
	cd server
	npm run build:prod
	npm run serve

.ONESHELL:
run-ui-prod: ## Run the ui in production mode
	cd ui
	npm run build:prod
	npm run serve