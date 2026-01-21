#!/bin/bash
# Run all SalesAI services for development

cd "$(dirname "$0")" || exit 1

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        SalesAI - Full Stack Development Environment            ║"
echo "║                                                                ║"
echo "║  This script will start 3 services in separate tmux windows:  ║"
echo "║  1. Frontend (React/Vite) on http://localhost:8080           ║"
echo "║  2. Ingestion (Node.js)  http://localhost:4010             ║"
echo "║  3. Orchestration (Python) on http://localhost:4011          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux not found. Install with:"
    echo "  macOS: brew install tmux"
    echo "  Linux: sudo apt-get install tmux"
    exit 1
fi

SESSION="salesai-dev"

# Kill existing session if it exists
tmux kill-session -t $SESSION 2>/dev/null

# Create new session
tmux new-session -d -s $SESSION

# Window 0: Frontend
echo "Starting Frontend..."
FRONTEND_DIR="$(pwd)"
tmux send-keys -t $SESSION:0 "cd \"$FRONTEND_DIR\" && pnpm dev" Enter
tmux rename-window -t $SESSION:0 "Frontend"

# Window 1: Ingestion
echo "Starting Ingestion Service..."
tmux new-window -t $SESSION -n "Ingestion"
INGESTION_DIR="$(pwd)/server/ingestion"
tmux send-keys -t $SESSION:1 "cd \"$INGESTION_DIR\" && pnpm dev" Enter

# Window 2: Orchestration
echo "Ensuring port 4011 is clear..."
fuser -k 4011/tcp 2>/dev/null # Kills anything on 4011 specifically

echo "Starting Orchestration Service..."

tmux new-window -t $SESSION -n "Orchestration"
ORCHESTRATION_DIR="$(pwd)/orchestration"
tmux send-keys -t $SESSION:2 "cd \"$ORCHESTRATION_DIR\" && poetry run uvicorn src.main:app --host 0.0.0.0 --port 4011 --reload" Enter

# Display windows
tmux select-window -t $SESSION:0
tmux set -g mouse on       

echo ""
echo "✅ Services starting in tmux session '$SESSION'"
echo ""
echo "View windows:"
echo "  tmux attach -t $SESSION"
echo ""
echo "Navigate:"
echo "  Ctrl+B, 0  → Frontend (8080)"
echo "  Ctrl+B, 1  → Ingestion (4010)"
echo "  Ctrl+B, 2  → Orchestration (4011)"
echo ""
echo "Stop all: tmux kill-session -t $SESSION"
echo ""

# Attach to session
tmux attach -t $SESSION
