from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    TESTING: bool = False
    SUPABASE_URL: str = "https://dfonvcgvleukpnjhypgd.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_Pg4vtpSIjJQBzgyiNET8VQ_-VtPfP8S"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SECRET_KEY: str = "pawtrack-super-secret-jwt-key-2026-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OWNER_EMAIL: str = "akashhabib577@gmail.com"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
