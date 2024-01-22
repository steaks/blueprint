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