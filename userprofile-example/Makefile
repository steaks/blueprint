install:
	bash ./scripts/install.sh

build:
	bash ./scripts/build.sh

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