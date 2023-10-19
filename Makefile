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

deploy-userprofile-diagram:
	docker build -f Dockerfile.userprofile-diagram --tag userprofile-diagram .
	docker tag userprofile-diagram us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-diagram:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-diagram
	gcloud run deploy userprofile-diagram --project=blueprint-8675309 --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/userprofile-diagram:latest --port=3001 --max-instances=1 --region=us-central1 --allow-unauthenticated