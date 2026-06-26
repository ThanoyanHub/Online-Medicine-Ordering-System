# Updated S3 configuration
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Online Medicine Ordering System"
    environment: str = "development"
    database_url: str = "mysql+pymysql://medicine_user:medicine_pass@localhost:3306/medicine_ordering"
    jwt_secret_key: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    aws_s3_bucket: str = "medicine-ordering-system"
    s3_public_base_url: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
