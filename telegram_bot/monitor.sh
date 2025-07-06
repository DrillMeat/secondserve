#!/bin/bash

# Monitoring script for Telegram Bot
# Usage: ./monitor.sh [check|restart|status|logs]

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

check_docker_bot() {
    log "Checking Docker bot status..."
    
    if docker-compose ps | grep -q "telegram-business-bot.*Up"; then
        log "✅ Docker bot is running"
        return 0
    else
        error "❌ Docker bot is not running"
        return 1
    fi
}

check_systemd_bot() {
    log "Checking systemd bot status..."
    
    if systemctl is-active --quiet telegram-bot; then
        log "✅ Systemd bot is running"
        return 0
    else
        error "❌ Systemd bot is not running"
        return 1
    fi
}

check_process_bot() {
    log "Checking for bot process..."
    
    if pgrep -f "python.*main.py" > /dev/null; then
        log "✅ Bot process is running"
        return 0
    else
        error "❌ Bot process is not running"
        return 1
    fi
}

check_logs() {
    log "Checking bot logs..."
    
    if [[ -f "bot.log" ]]; then
        # Check if log was updated in last 5 minutes
        if [[ $(find bot.log -mmin -5) ]]; then
            log "✅ Bot logs are recent"
            return 0
        else
            warn "⚠️ Bot logs are stale (older than 5 minutes)"
            return 1
        fi
    else
        warn "⚠️ No bot.log file found"
        return 1
    fi
}

restart_docker_bot() {
    log "Restarting Docker bot..."
    docker-compose down
    docker-compose up -d --build
    sleep 10
    check_docker_bot
}

restart_systemd_bot() {
    log "Restarting systemd bot..."
    sudo systemctl restart telegram-bot
    sleep 5
    check_systemd_bot
}

show_docker_logs() {
    log "Showing Docker bot logs..."
    docker-compose logs -f --tail=50
}

show_systemd_logs() {
    log "Showing systemd bot logs..."
    sudo journalctl -u telegram-bot -f -n 50
}

show_file_logs() {
    log "Showing bot.log..."
    if [[ -f "bot.log" ]]; then
        tail -f bot.log
    else
        error "bot.log not found"
    fi
}

check_health() {
    log "Performing health check..."
    
    local healthy=true
    
    # Check if any bot is running
    if check_docker_bot 2>/dev/null || check_systemd_bot 2>/dev/null || check_process_bot 2>/dev/null; then
        log "✅ Bot service is running"
    else
        error "❌ No bot service found running"
        healthy=false
    fi
    
    # Check logs
    if ! check_logs; then
        healthy=false
    fi
    
    # Check disk space
    local disk_usage=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $disk_usage -gt 90 ]]; then
        error "❌ Disk usage is ${disk_usage}% - critically high"
        healthy=false
    elif [[ $disk_usage -gt 80 ]]; then
        warn "⚠️ Disk usage is ${disk_usage}% - getting high"
    else
        log "✅ Disk usage is ${disk_usage}% - OK"
    fi
    
    # Check memory usage
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [[ $mem_usage -gt 90 ]]; then
        error "❌ Memory usage is ${mem_usage}% - critically high"
        healthy=false
    elif [[ $mem_usage -gt 80 ]]; then
        warn "⚠️ Memory usage is ${mem_usage}% - getting high"
    else
        log "✅ Memory usage is ${mem_usage}% - OK"
    fi
    
    if $healthy; then
        log "🎉 Overall health: GOOD"
        return 0
    else
        error "💥 Overall health: POOR"
        return 1
    fi
}

auto_restart() {
    log "Attempting automatic restart..."
    
    if docker-compose ps &>/dev/null; then
        restart_docker_bot
    elif systemctl list-unit-files | grep -q telegram-bot; then
        restart_systemd_bot
    else
        error "Cannot determine how to restart bot"
        return 1
    fi
}

show_status() {
    log "Bot Status Report"
    echo "===================="
    
    # Check different deployment methods
    echo "🐳 Docker Status:"
    if check_docker_bot 2>/dev/null; then
        docker-compose ps
    else
        echo "   Not running via Docker"
    fi
    
    echo ""
    echo "🔧 Systemd Status:"
    if systemctl list-unit-files | grep -q telegram-bot; then
        systemctl status telegram-bot --no-pager
    else
        echo "   Not installed as systemd service"
    fi
    
    echo ""
    echo "📊 Process Status:"
    if pgrep -f "python.*main.py" > /dev/null; then
        ps aux | grep -v grep | grep "python.*main.py"
    else
        echo "   No direct Python process found"
    fi
    
    echo ""
    echo "📁 Files Status:"
    echo "   bot.log: $(if [[ -f bot.log ]]; then echo "EXISTS ($(stat -c%s bot.log) bytes)"; else echo "NOT FOUND"; fi)"
    echo "   .env: $(if [[ -f .env ]]; then echo "EXISTS"; else echo "NOT FOUND"; fi)"
    echo "   business_connections.json: $(if [[ -f business_connections.json ]]; then echo "EXISTS"; else echo "NOT FOUND"; fi)"
    
    echo ""
    check_health
}

show_help() {
    echo "Telegram Bot Monitoring Script"
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check    - Perform health check"
    echo "  restart  - Restart the bot"
    echo "  status   - Show detailed status"
    echo "  logs     - Show bot logs"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check"
    echo "  $0 restart"
    echo "  $0 logs"
}

main() {
    case "${1:-help}" in
        check)
            check_health
            ;;
        restart)
            auto_restart
            ;;
        status)
            show_status
            ;;
        logs)
            if docker-compose ps &>/dev/null; then
                show_docker_logs
            elif systemctl list-unit-files | grep -q telegram-bot; then
                show_systemd_logs
            else
                show_file_logs
            fi
            ;;
        help|*)
            show_help
            ;;
    esac
}

main "$@"