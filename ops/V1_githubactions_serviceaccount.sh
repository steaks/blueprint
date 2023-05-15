gcloud iam service-accounts create github-actions --description="Github Actions Service Account" --display-name="Github Actions"
gcloud projects add-iam-policy-binding blueprint-8675309 --member="serviceAccount:github-actions@blueprint-8675309.iam.gserviceaccount.com" --role="roles/artifactregistry.writer"
gcloud services enable iamcredentials.googleapis.com
gcloud iam workload-identity-pools create "github-actions-pool-2" --display-name="Github Actions Pool" --location="global"
gcloud iam workload-identity-pools providers create-oidc "github-actions-provider-2" \
  --location="global" \
  --workload-identity-pool="github-actions-pool-2" \
  --display-name="Github Actions provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
gcloud iam service-accounts add-iam-policy-binding "github-actions@blueprint-8675309.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/135708369468/locations/global/workloadIdentityPools/github-actions-pool-2/attribute.repository_owner/steaks"
