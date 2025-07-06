#!/bin/bash

# Simple start script for the Telegram bot

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if .env exists
if [[ ! -f ".env" ]]; then
    log "Creating .env from template..."
    cp .env.example .env
    echo "Please edit .env file with your bot token and admin ID"
    exit 1
fi

# Check if virtual environment exists
if [[ ! -d "venv" ]]; then
    log "Creating virtual environment..."
    python3 -m venv venv
    
    log "Installing dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
fi

# Activate virtual environment and start bot
log "Starting Telegram bot..."
source venv/bin/activate
python main.py