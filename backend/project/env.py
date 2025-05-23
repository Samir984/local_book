from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    DEBUG: bool = True
    POSTGRES_HOST: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_DB: str = "local_book_db"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_PORT: int = 5432
    ALLOWED_HOSTS: str = "*"
    CSRF_TRUSTED_ORIGINS: str = "http://127.0.0.1:8000"
    SECRET_KEY: str = "STRONG_KEY"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_STORAGE_BUCKET_NAME: str = ""
    AWS_STORAGE_REGION: str = ""


ENV = Environment()
