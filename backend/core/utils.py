import boto3

from project.env import ENV

s3_client = boto3.client(  # type: ignore
    "s3",
    aws_access_key_id=ENV.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=ENV.AWS_SECRET_ACCESS_KEY,
    region_name=ENV.AWS_STORAGE_REGION,
)

BUCKET_NAME = ENV.AWS_STORAGE_BUCKET_NAME
REGION_NAME = ENV.AWS_STORAGE_REGION

MAX_UPLOAD_SIZE = 2 * 1024 * 1024
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"]
MIME_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
}
