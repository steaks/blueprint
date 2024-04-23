install:
	bash ./scripts/install.sh

install-core:
	bash ./scripts/installCore.sh

build-core:
	bash ./scripts/buildCore.sh

build:
	bash ./scripts/build.sh

test:
	bash ./scripts/test.sh

clean:
	bash ./scripts/clean.sh

zip-templates:
	bash ./scripts/zipTemplates.sh

npmpublish:
	bash ./scripts/publish.sh

npm-artifact-registry-authenticate:
	npx google-artifactregistry-auth

docker-authenticate:
	gcloud auth configure-docker us-central1-docker.pkg.dev

deploy-rectangle-server:
	docker build -f Dockerfile.rectangle-server --tag rectangle-server .
	docker tag rectangle-server us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-server:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-server
	gcloud run deploy rectangle-server --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-server:latest --port=8080 --min-instances=1 --max-instances=1 --region=us-central1 --allow-unauthenticated

deploy-rectangle-ui:
	docker build -f Dockerfile.rectangle-ui --tag rectangle-ui .
	docker tag rectangle-ui us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-ui:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-ui
	gcloud run deploy rectangle-ui --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/rectangle-ui:latest --port=3000 --min-instances=1 --max-instances=1 --region=us-central1 --allow-unauthenticated

deploy-usermanagement-server:
	docker build -f Dockerfile.usermanagement-server --tag usermanagement-server .
	docker tag usermanagement-server us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-server:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-server
	gcloud run deploy usermanagement-server --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-server:latest --port=8080 --min-instances=1 --max-instances=1 --region=us-central1 --allow-unauthenticated

deploy-usermanagement-ui:
	docker build -f Dockerfile.usermanagement-ui --tag usermanagement-ui .
	docker tag usermanagement-ui us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-ui:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-ui
	gcloud run deploy usermanagement-ui --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/usermanagement-ui:latest --port=3000 --min-instances=1 --max-instances=1 --region=us-central1 --allow-unauthenticated