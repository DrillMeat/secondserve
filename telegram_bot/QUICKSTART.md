# Quick Start Guide

## 🚀 Deploy in 30 seconds

### Option 1: Docker (Recommended)
```bash
cd telegram_bot
docker-compose up -d
```

### Option 2: Python Virtual Environment
```bash
cd telegram_bot
./start.sh
```

### Option 3: One-Line Deploy Script
```bash
cd telegram_bot
./deploy.sh docker
```

## 📱 Test Your Bot

1. Open Telegram and search for your bot
2. Send `/start` command
3. Follow the instructions to connect as a business bot

## 🔧 Configuration

Your bot is already configured with:
- **Bot Token**: `7339741334:AAGKYivJ5ttvDxvC4OgAXpQs0quNQHpn0ww`
- **Admin ID**: `1948254891`

## 📊 Monitor Your Bot

```bash
# Check status
./monitor.sh status

# View logs
./monitor.sh logs

# Health check
./monitor.sh check

# Restart if needed
./monitor.sh restart
```

## 🌐 Access Health Check

Once running, visit: `http://localhost:8000/health`

## 🛠️ Troubleshooting

If something goes wrong:
1. Check logs: `./monitor.sh logs`
2. Check status: `./monitor.sh status`
3. Restart: `./monitor.sh restart`

## 📚 Full Documentation

See `README.md` for detailed deployment options and configuration.

---

**Your bot is ready to go! 🎉**