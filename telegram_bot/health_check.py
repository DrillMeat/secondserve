#!/usr/bin/env python3
"""
Health check endpoint for monitoring bot status
"""

import asyncio
import logging
from datetime import datetime
from aiohttp import web
import json
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HealthChecker:
    def __init__(self):
        self.start_time = datetime.now()
        self.bot_status = "unknown"
        self.last_check = None
        
    async def check_bot_health(self):
        """Check if bot is running and responsive"""
        try:
            # Check if bot.log exists and was recently updated
            if os.path.exists("bot.log"):
                stat = os.stat("bot.log")
                last_modified = datetime.fromtimestamp(stat.st_mtime)
                time_diff = datetime.now() - last_modified
                
                if time_diff.seconds < 300:  # 5 minutes
                    self.bot_status = "healthy"
                else:
                    self.bot_status = "stale"
            else:
                self.bot_status = "no_logs"
                
            self.last_check = datetime.now()
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            self.bot_status = "error"
            
    async def health_endpoint(self, request):
        """HTTP endpoint for health checks"""
        await self.check_bot_health()
        
        uptime = datetime.now() - self.start_time
        
        health_data = {
            "status": self.bot_status,
            "uptime_seconds": int(uptime.total_seconds()),
            "last_check": self.last_check.isoformat() if self.last_check else None,
            "timestamp": datetime.now().isoformat()
        }
        
        status_code = 200 if self.bot_status == "healthy" else 503
        
        return web.json_response(health_data, status=status_code)

async def create_app():
    """Create web application"""
    health_checker = HealthChecker()
    
    app = web.Application()
    app.router.add_get('/health', health_checker.health_endpoint)
    app.router.add_get('/', health_checker.health_endpoint)
    
    return app

async def main():
    """Main function"""
    app = await create_app()
    
    # Start web server
    runner = web.AppRunner(app)
    await runner.setup()
    
    site = web.TCPSite(runner, '0.0.0.0', 8000)
    await site.start()
    
    logger.info("Health check server started on port 8000")
    
    # Keep running
    try:
        while True:
            await asyncio.sleep(3600)  # Sleep for 1 hour
    except KeyboardInterrupt:
        logger.info("Shutting down health check server")
    finally:
        await runner.cleanup()

if __name__ == "__main__":
    asyncio.run(main())