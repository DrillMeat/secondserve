#!/bin/bash

# Telegram Bot Deployment Script
# Usage: ./deploy.sh [docker|venv|systemd]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

check_requirements() {
    log "Checking requirements..."
    
    if [[ ! -f ".env" ]]; then
        warn ".env file not found. Creating from template..."
        cp .env.example .env
        warn "Please edit .env file with your bot token and admin ID"
        read -p "Press Enter to continue after editing .env..."
    fi
    
    # Validate environment variables
    source .env
    if [[ -z "$BOT_TOKEN" || "$BOT_TOKEN" == "your_bot_token_here" ]]; then
        error "Please set BOT_TOKEN in .env file"
    fi
    
    if [[ -z "$ADMIN_ID" || "$ADMIN_ID" == "your_admin_id_here" ]]; then
        error "Please set ADMIN_ID in .env file"
    fi
    
    log "Requirements check passed"
}

deploy_docker() {
    log "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker not found. Please install Docker first"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose not found. Please install Docker Compose first"
    fi
    
    log "Building and starting containers..."
    docker-compose up -d --build
    
    log "Waiting for container to start..."
    sleep 10
    
    log "Checking container status..."
    docker-compose ps
    
    log "Deployment completed! Use 'docker-compose logs -f' to view logs"
}

deploy_venv() {
    log "Deploying with Python virtual environment..."
    
    if ! command -v python3 &> /dev/null; then
        error "Python 3 not found. Please install Python 3.9+ first"
    fi
    
    log "Creating virtual environment..."
    python3 -m venv venv
    
    log "Installing dependencies..."
    source venv/bin/activate
    pip install -r requirements.txt
    
    log "Starting bot..."
    python main.py
}

deploy_systemd() {
    log "Deploying with systemd service..."
    
    if [[ $EUID -ne 0 ]]; then
        error "This deployment method requires root privileges. Run with sudo"
    fi
    
    log "Creating bot user..."
    id -u telegram-bot &>/dev/null || useradd -r -s /bin/false telegram-bot
    
    log "Setting up directories..."
    mkdir -p /opt/telegram-bot
    cp -r . /opt/telegram-bot/
    chown -R telegram-bot:telegram-bot /opt/telegram-bot
    
    log "Creating virtual environment..."
    sudo -u telegram-bot python3 -m venv /opt/telegram-bot/venv
    sudo -u telegram-bot /opt/telegram-bot/venv/bin/pip install -r /opt/telegram-bot/requirements.txt
    
    log "Installing systemd service..."
    cp telegram-bot.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable telegram-bot
    systemctl start telegram-bot
    
    log "Checking service status..."
    systemctl status telegram-bot
    
    log "Deployment completed! Use 'sudo systemctl status telegram-bot' to check status"
}

show_help() {
    echo "Telegram Bot Deployment Script"
    echo "Usage: $0 [METHOD]"
    echo ""
    echo "Methods:"
    echo "  docker   - Deploy using Docker (recommended)"
    echo "  venv     - Deploy using Python virtual environment"
    echo "  systemd  - Deploy as systemd service (requires root)"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 docker"
    echo "  sudo $0 systemd"
}

main() {
    case "${1:-help}" in
        docker)
            check_requirements
            deploy_docker
            ;;
        venv)
            check_requirements
            deploy_venv
            ;;
        systemd)
            check_requirements
            deploy_systemd
            ;;
        help|*)
            show_help
            ;;
    esac
}

main "$@"