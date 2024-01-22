install: ## Install dependencies for the server and ui of your application
	bash ./scripts/install.sh

build: ## Build the server and ui for your application
	bash ./scripts/build.sh

clean: ## Clean ther server and ui for your application (e.g. node_modules, build, types directories)
	bash ./scripts/clean.sh

.ONESHELL:
run-ui: ## Run the ui
	cd ui
	npm run start

.ONESHELL:
run-server: ## Run the server
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

help: ## Display help
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)