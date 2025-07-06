#!/bin/bash

# GitHub Repository Setup Script
# This script helps you set up a GitHub repository for your Telegram bot

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
}

check_git() {
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git first."
        exit 1
    fi
    log "Git is installed"
}

check_github_cli() {
    if ! command -v gh &> /dev/null; then
        warn "GitHub CLI is not installed. You'll need to create the repository manually."
        return 1
    fi
    log "GitHub CLI is installed"
    return 0
}

init_git_repo() {
    log "Initializing Git repository..."
    
    if [[ -d ".git" ]]; then
        log "Git repository already exists"
    else
        git init
        log "Git repository initialized"
    fi
    
    # Add all files
    git add .
    git commit -m "Initial commit: Telegram Business Bot setup"
    log "Initial commit created"
}

create_github_repo() {
    log "Creating GitHub repository..."
    
    echo "Enter repository name (default: telegram-bot):"
    read -r repo_name
    repo_name=${repo_name:-telegram-bot}
    
    echo "Enter repository description (default: Telegram Business Bot):"
    read -r repo_description
    repo_description=${repo_description:-"Telegram Business Bot"}
    
    if check_github_cli; then
        # Create repository with GitHub CLI
        gh repo create "$repo_name" --description "$repo_description" --public
        git remote add origin "https://github.com/$(gh api user --jq .login)/$repo_name.git"
        git push -u origin main
        log "Repository created and pushed to GitHub"
    else
        # Manual instructions
        warn "Please create the repository manually:"
        echo "1. Go to https://github.com/new"
        echo "2. Repository name: $repo_name"
        echo "3. Description: $repo_description"
        echo "4. Make it public"
        echo "5. Don't initialize with README"
        echo "6. Create repository"
        echo ""
        echo "Then run these commands:"
        echo "git remote add origin https://github.com/YOUR_USERNAME/$repo_name.git"
        echo "git branch -M main"
        echo "git push -u origin main"
    fi
}

create_deployment_links() {
    log "Creating deployment links..."
    
    echo "Enter your GitHub username:"
    read -r github_username
    
    echo "Enter your repository name (default: telegram-bot):"
    read -r repo_name
    repo_name=${repo_name:-telegram-bot}
    
    # Create deployment links file
    cat > DEPLOYMENT_LINKS.md << EOF
# 🚀 One-Click Deployment Links

## Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/telegram-bot?referralCode=YOUR_CODE)

## Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/$github_username/$repo_name)

## Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/$github_username/$repo_name)

## Replit
[Open in Replit](https://replit.com/github/$github_username/$repo_name)

---

## Manual Setup Links

- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Heroku**: [heroku.com](https://heroku.com)
- **Replit**: [replit.com](https://replit.com)

## Repository
- **GitHub**: https://github.com/$github_username/$repo_name
EOF
    
    log "Created DEPLOYMENT_LINKS.md"
}

update_readme() {
    log "Updating README with deployment links..."
    
    # Add deployment badges to README
    if [[ -f "README.md" ]]; then
        # Create backup
        cp README.md README.md.backup
        
        # Add deployment section at the top
        cat > README_NEW.md << 'EOF'
# 🚀 Quick Deploy (FREE)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/telegram-bot)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

---

EOF
        
        # Append original README
        cat README.md >> README_NEW.md
        mv README_NEW.md README.md
        
        log "README updated with deployment badges"
    fi
}

main() {
    log "🚀 Setting up GitHub repository for Telegram Bot..."
    
    check_git
    init_git_repo
    create_github_repo
    create_deployment_links
    update_readme
    
    log "✅ GitHub repository setup complete!"
    echo ""
    log "Next steps:"
    echo "1. Your repository is now ready for deployment"
    echo "2. Check DEPLOYMENT_LINKS.md for one-click deployment options"
    echo "3. Choose your preferred hosting platform"
    echo "4. Deploy your bot in under 5 minutes!"
    echo ""
    log "🎉 Your bot is ready to host for FREE!"
}

main "$@"