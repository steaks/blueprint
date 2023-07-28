gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud sql instances create citifakebank --tier=db-g1-small --region=us-central1 --database-version=POSTGRES_14
gcloud sql users set-password postgres --instance=citifakebank --password={https://my.1password.com/vaults/clqp34uej5yzxcwjqd6oyrt2ay/allitems/chhsrhx7mtrbnxdmivpv5fjtli}
gcloud sql users create CITIFAKEBANK_BOT --instance=citifakebank --password={https://my.1password.com/vaults/clqp34uej5yzxcwjqd6oyrt2ay/allitems/2azy53xzjdoiig7nksmmknyifu}