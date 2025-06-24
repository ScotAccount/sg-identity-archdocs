require 'govuk_tech_docs'

GovukTechDocs.configure(self)

activate :dotenv

activate :s3_sync do |s3_sync|
  s3_sync.bucket                     = ENV['S3_BUCKET_NAME']
  s3_sync.region                     = ENV['AWS_REGION']
  s3_sync.aws_access_key_id          = ENV['AWS_ACCESS_KEY_ID']
  s3_sync.aws_secret_access_key      = ENV['AWS_SECRET_ACCESS_KEY']
  s3_sync.delete                     = true
  s3_sync.after_build                = false
end