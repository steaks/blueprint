gcloud services enable artifactregistry.googleapis.com
# This command did not work and failed with this error: ERROR: (gcloud.artifacts.repositories.create) INVALID_ARGUMENT: Maven config is not supported for format "NPM"
# I think this was a bug so I created the repository in the UI. https://console.cloud.google.com/artifacts/npm/blueprint-8675309/us-central1/blueprint?project=blueprint-8675309
gcloud artifacts repositories create blueprint --repository-format="npm" --location="us-central1" --description="Blueprint"
# This command did not work and failed with this error: ERROR: (gcloud.artifacts.repositories.create) INVALID_ARGUMENT: Maven config is not supported for format "DOCKER"
# I think this was a bug so I created the repository in the UI. https://console.cloud.google.com/artifacts/docker/blueprint-8675309/us-central1/blueprint-websites?project=blueprint-8675309
gcloud artifacts repositories create blueprint-websites --repository-format="docker" --location="us-central1" --description="Blueprint Websites"
