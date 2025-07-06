#!/usr/bin/env python3
"""
Replit setup script for Telegram bot
Run this once to set up your bot on Replit
"""

import os
import json

def create_replit_config():
    """Create .replit configuration file"""
    config = {
        "language": "python3",
        "run": "python main.py",
        "modules": ["python3"],
        "entrypoint": "main.py",
        "hidden": [".env", "*.log", "*.json"]
    }
    
    with open('.replit', 'w') as f:
        json.dump(config, f, indent=2)
    print("✅ Created .replit configuration")

def create_keep_alive():
    """Create keep_alive.py to prevent sleeping"""
    keep_alive_code = '''
import asyncio
import aiohttp
from aiohttp import web
import threading
import logging

logger = logging.getLogger(__name__)

async def keep_alive_handler(request):
    """Simple handler to keep the repl alive"""
    return web.Response(text="Bot is alive!")

async def start_keep_alive():
    """Start keep alive server"""
    app = web.Application()
    app.router.add_get('/', keep_alive_handler)
    app.router.add_get('/health', keep_alive_handler)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', 8080)
    await site.start()
    logger.info("Keep alive server started on port 8080")

def run_keep_alive():
    """Run keep alive server in background"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(start_keep_alive())
    loop.run_forever()

def start_keep_alive_thread():
    """Start keep alive in a separate thread"""
    thread = threading.Thread(target=run_keep_alive, daemon=True)
    thread.start()
    return thread
'''
    
    with open('keep_alive.py', 'w') as f:
        f.write(keep_alive_code)
    print("✅ Created keep_alive.py")

def update_main_py():
    """Update main.py to include keep alive"""
    # Read current main.py
    with open('main.py', 'r') as f:
        content = f.read()
    
    # Add keep alive import if not present
    if 'keep_alive' not in content:
        # Add import at the top
        lines = content.split('\n')
        import_line = 'from keep_alive import start_keep_alive_thread'
        
        # Find the best place to insert
        insert_index = 0
        for i, line in enumerate(lines):
            if line.startswith('import ') or line.startswith('from '):
                insert_index = i + 1
        
        lines.insert(insert_index, import_line)
        
        # Add keep alive start in main function
        for i, line in enumerate(lines):
            if 'async def main():' in line:
                lines.insert(i + 1, '    start_keep_alive_thread()  # Keep Replit alive')
                break
        
        # Write back
        with open('main.py', 'w') as f:
            f.write('\n'.join(lines))
        
        print("✅ Updated main.py with keep alive")
    else:
        print("✅ Keep alive already present in main.py")

def create_secrets_info():
    """Create info about secrets setup"""
    secrets_info = """
# Replit Secrets Setup

Go to the "Secrets" tab in your Replit environment and add:

1. BOT_TOKEN = 7339741334:AAGKYivJ5ttvDxvC4OgAXpQs0quNQHpn0ww
2. ADMIN_ID = 1948254891
3. LOG_LEVEL = INFO

These will be automatically loaded as environment variables.
"""
    
    with open('REPLIT_SECRETS.md', 'w') as f:
        f.write(secrets_info)
    print("✅ Created REPLIT_SECRETS.md")

def main():
    """Main setup function"""
    print("🚀 Setting up Telegram bot for Replit...")
    
    create_replit_config()
    create_keep_alive()
    update_main_py()
    create_secrets_info()
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Set up secrets in Replit (see REPLIT_SECRETS.md)")
    print("2. Click 'Run' to start your bot")
    print("3. Optional: Set up UptimeRobot to ping your repl")

if __name__ == "__main__":
    main()