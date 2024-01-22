install:
	bash ./scripts/install.sh

build:
	bash ./scripts/build.sh

test:
	bash ./scripts/test.sh

clean:
	bash ./scripts/clean.sh

npmpublish:
	bash ./scripts/publish.sh

npm-artifact-registry-authenticate:
	npx google-artifactregistry-auth

docker-authenticate:
	gcloud auth configure-docker us-central1-docker.pkg.dev

deploy-userprofile-server:
	docker build -f Dockerfile.userprofile-server --tag userprofile-server .
	docker tag userprofile-server us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-server:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-server
	gcloud run deploy userprofile-server --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-server:latest --port=8080 --max-instances=1 --region=us-central1 --allow-unauthenticated

deploy-userprofile-ui:
	docker build -f Dockerfile.userprofile-ui --tag userprofile-ui .
	docker tag userprofile-ui us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-ui:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-ui
	gcloud run deploy userprofile-ui --project=blueprint-8675309 --memory=2Gi --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-ui:latest --port=3000 --max-instances=1 --region=us-central1 --allow-unauthenticated

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