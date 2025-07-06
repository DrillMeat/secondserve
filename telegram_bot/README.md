# Telegram Business Bot

A Telegram bot for managing business connections and transferring gifts/stars automatically.

## Features

- **Business Connection Management**: Automatically handles new business connections
- **Gift Transfer**: Transfers unique gifts to admin account
- **Logging**: Comprehensive logging of all operations
- **Error Handling**: Robust error handling with detailed reporting
- **Admin Panel**: Special commands for administrators

## Setup

### 1. Clone and Configure

```bash
git clone <your-repo-url>
cd telegram_bot
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file:
```env
BOT_TOKEN=your_bot_token_here
ADMIN_ID=your_admin_id_here
LOG_LEVEL=INFO
```

### 3. Deployment Options

## Option A: Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Deploy
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Option B: Python Virtual Environment

### Prerequisites
- Python 3.9+
- pip

### Deploy
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the bot
python main.py
```

## Option C: VPS with Systemd

### Prerequisites
- Ubuntu/Debian VPS
- Python 3.9+
- systemd

### Deploy
```bash
# Install Python and pip
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Create bot user
sudo useradd -r -s /bin/false telegram-bot

# Create directories
sudo mkdir -p /opt/telegram-bot
sudo chown telegram-bot:telegram-bot /opt/telegram-bot

# Copy files
sudo cp -r . /opt/telegram-bot/
sudo chown -R telegram-bot:telegram-bot /opt/telegram-bot

# Create virtual environment
sudo -u telegram-bot python3 -m venv /opt/telegram-bot/venv
sudo -u telegram-bot /opt/telegram-bot/venv/bin/pip install -r /opt/telegram-bot/requirements.txt

# Create systemd service
sudo cp telegram-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot

# Check status
sudo systemctl status telegram-bot
```

## Hosting Platforms

### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-bot-name

# Set environment variables
heroku config:set BOT_TOKEN=your_token
heroku config:set ADMIN_ID=your_id

# Deploy
git push heroku main
```

### Railway
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### DigitalOcean App Platform
1. Create new app from GitHub
2. Set environment variables
3. Deploy

### AWS EC2
```bash
# SSH to your instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Clone and deploy
git clone <your-repo>
cd telegram_bot
cp .env.example .env
# Edit .env with your values
docker-compose up -d
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BOT_TOKEN` | Telegram bot token | Required |
| `ADMIN_ID` | Admin user ID | Required |
| `LOG_LEVEL` | Logging level | INFO |

### Files Created

- `business_connections.json` - Stores business connections
- `transfer_log.json` - Logs all transfer operations
- `bot.log` - Application logs

## Commands

### Admin Commands
- `/start` - Show admin panel
- `/check_gifts` - Check and transfer gifts from all connections

### User Commands
- `/start` - Show welcome message and connection instructions

## Monitoring

### View Logs
```bash
# Docker
docker-compose logs -f

# Systemd
sudo journalctl -u telegram-bot -f

# Direct
tail -f bot.log
```

### Health Checks
The bot creates log entries for all operations. Monitor `bot.log` for any errors.

## Security

- Bot token is stored in environment variables
- Admin ID is configurable
- All operations are logged
- Error handling prevents crashes

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check bot token
   - Verify bot is started with BotFather
   - Check logs for errors

2. **Connection issues**
   - Verify business connection is active
   - Check if bot has necessary permissions

3. **Transfer failures**
   - Check if admin ID is correct
   - Verify bot has access to business account

### Debug Mode
Set `LOG_LEVEL=DEBUG` in `.env` for detailed logging.

## Support

For issues and questions:
1. Check the logs first
2. Verify configuration
3. Review Telegram Bot API documentation