#!/bin/bash
# Run the orchestration service

cd "$(dirname "$0")" || exit 1

echo "Starting SalesAI Orchestration Service..."
echo "Port: 4011"
echo ""

# Check if .env exists
if [ ! -f orchestration/.env ]; then
    echo "⚠️  Warning: orchestration/.env not found"
    echo "Creating from .env.example..."
    cp orchestration/.env.example orchestration/.env
    echo "✅ Created orchestration/.env (update with your API keys)"
fi

# Install dependencies if needed
if ! poetry --version > /dev/null 2>&1; then
    echo "❌ Poetry not found. Install with: curl -sSL https://install.python-poetry.org | python3 -"
    exit 1
fi

cd orchestration

# Install dependencies
echo "Installing dependencies..."
poetry install

# Run the service
echo ""
echo "🚀 Starting orchestration service..."
poetry run uvicorn src.main:app --host 0.0.0.0 --port 4011 --reload

