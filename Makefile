install:
	bash install.sh

build:
	bash build.sh

test:
	bash test.sh

clean:
	bash clean.sh

npmpublish:
	bash publish.sh

npm-artifact-registry-authenticate:
	npx google-artifactregistry-auth --repo-config=[./.npmrc] --credential-config=[~/.npmrc]

docker-authenticate:
	gcloud auth configure-docker us-central1-docker.pkg.dev

deploy-citifakebank:
	docker build -f Dockerfile.citifakebank --tag citifakebank .
	docker tag citifakebank us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank
	gcloud run deploy citifakebank --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank:latest --port=3000 --max-instances=1 --region=us-central1 --allow-unauthenticated

deploy-citifakebank-blueprint:
	docker build -f Dockerfile.citifakebank-blueprint --tag citifakebank-blueprint .
	docker tag citifakebank-blueprint us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank-blueprint:latest
	docker push us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank-blueprint
	gcloud run deploy citifakebank-blueprint --image=us-central1-docker.pkg.dev/blueprint-8675309/blueprint-websites/citifakebank-blueprint:latest --port=3001 --max-instances=1 --region=us-central1 --allow-unauthenticated

