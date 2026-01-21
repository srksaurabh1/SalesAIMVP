import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # GROQ
    groq_api_url: str = "https://api.groq.com/openai/v1/chat/completions"
    groq_api_key: str = "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"
    groq_model: str = "openai/gpt-oss-120b"
    
    # PostgreSQL + pgvector
    pg_host: str = "localhost"
    pg_port: int = 5432
    pg_user: str = "postgres"
    pg_password: str = "postgres"
    pg_database: str = "salesai"
    
    # Milvus
    milvus_host: str = "localhost"
    milvus_port: int = 19530
    
    # Neo4j
    neo4j_uri: str = "neo4j://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "password"
    
    # RabbitMQ
    rabbitmq_url: str = "amqp://localhost"
    rabbitmq_queue: str = "ingestion.documents"
    
    # App
    port: int = 4011
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
