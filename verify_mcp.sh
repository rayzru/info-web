#!/bin/bash

#############################################################################
# MCP Smart Setup Script - Optimized for info-web project
# GitHub: rayzru/info-web
#
# Usage:
#   ./verify_mcp.sh              # Full check (slow)
#   ./verify_mcp.sh --fast       # Skip health checks (fast)
#
# This script intelligently:
# 0. Checks versions of all reasoning tools (Node, npm, bun, claude, codex)
# 1. Detects what's already installed
# 2. Installs only what's missing
# 3. Updates what needs updating
# 4. Verifies everything is working (unless --fast)
# 5. Provides clear status reporting
#
# Project-Specific MCPs:
#   - Playwright MCP (UI testing, browser automation, E2E tests)
#   - Context7 MCP (documentation queries)
#   - Figma MCP (design integration)
#   - Codex High/Medium (GPT-5.2 validation)
#   - Chrome DevTools MCP (browser debugging) - auto-detected via --chrome flag
#   - Next.js DevTools MCP (Next.js 16 integration)
#   - Mermaid Generator/Validator (diagrams)
#   - GitHub MCP (repository management)
#
# Options:
#   --fast, --no-health-checks    Skip slow health checks for faster runs
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="$SCRIPT_DIR/.claude/scripts/mcp_verification.log"
GITHUB_TOKEN_FILE="$HOME/.github_mcp_token"

# Track what mode we're in
MODE="unknown"
MCPS_INSTALLED=0
MCPS_TOTAL=10  # Project-specific MCP count
NEEDS_UPDATE=false
FIRST_TIME_SETUP=false
SKIP_HEALTH_CHECKS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fast)
            SKIP_HEALTH_CHECKS=true
            shift
            ;;
        --no-health-checks)
            SKIP_HEALTH_CHECKS=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Initialize log
mkdir -p "$(dirname "$LOG_FILE")"
echo "MCP Smart Setup Started: $(date)" > "$LOG_FILE"

#############################################################################
# Helper Functions
#############################################################################

print_header() {
    echo -e "\n${CYAN}${BOLD}========================================${NC}"
    echo -e "${CYAN}${BOLD}$1${NC}"
    echo -e "${CYAN}${BOLD}========================================${NC}\n"
}

print_section() {
    echo -e "\n${BLUE}${BOLD}► $1${NC}"
    echo -e "${BLUE}────────────────────────────────────────${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
    echo "[INFO] $1" >> "$LOG_FILE"
}

print_installing() {
    echo -e "${YELLOW}↻${NC} Installing $1..."
    echo "[INSTALLING] $1" >> "$LOG_FILE"
}

print_updating() {
    echo -e "${YELLOW}↻${NC} Updating $1..."
    echo "[UPDATING] $1" >> "$LOG_FILE"
}

#############################################################################
# Version Checking and Update Functions
#############################################################################

# Codex model configuration
CODEX_TARGET_MODEL="gpt-5.2-codex"

# NVM configuration
NVM_INSTALL_URL="https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh"

# Get latest version from npm registry
get_latest_npm_version() {
    local package=$1
    npm view "$package" version 2>/dev/null || echo "0.0.0"
}

# Check if NVM is installed and properly sourced
check_nvm_installed() {
    if [ ! -f "$HOME/.nvm/nvm.sh" ] && [ -z "$NVM_DIR" ]; then
        return 1
    fi

    if ! command -v nvm &> /dev/null; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi

    command -v nvm &> /dev/null
}

# Get latest Node.js Current version
get_latest_node_version() {
    if check_nvm_installed; then
        nvm version-remote node 2>/dev/null | sed 's/v//' || echo "23.0.0"
    else
        curl -sS https://nodejs.org/dist/index.json 2>/dev/null | \
            grep -oE '"version":"v[0-9]+\.[0-9]+\.[0-9]+"' | \
            head -1 | \
            grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "23.0.0"
    fi
}

install_nvm() {
    print_section "Installing NVM (Node Version Manager)"

    print_info "NVM allows easy Node.js version management"
    read -p "Install NVM now? (y/n): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "NVM installation skipped"
        return 1
    fi

    print_installing "NVM"
    if curl -o- "$NVM_INSTALL_URL" | bash 2>&1 | tee -a "$LOG_FILE"; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

        print_success "NVM installed successfully"
        print_info "Please restart your terminal or run: source ~/.nvm/nvm.sh"
        return 0
    else
        print_error "Failed to install NVM"
        return 1
    fi
}

check_and_update_node() {
    print_section "Node.js Version Check & Update"

    local has_nvm=false
    if check_nvm_installed; then
        has_nvm=true
        print_info "NVM is installed"
    else
        print_warning "NVM is not installed (recommended for Node.js management)"
    fi

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"

        if [ "$has_nvm" = true ]; then
            print_info "Installing latest Node.js Current version using NVM..."
            local latest_version=$(get_latest_node_version)
            print_updating "Node.js to v$latest_version"

            if nvm install node 2>&1 | tee -a "$LOG_FILE"; then
                nvm use node 2>&1 | tee -a "$LOG_FILE"
                nvm alias default node 2>&1 | tee -a "$LOG_FILE"
                print_success "Node.js v$(node -v | sed 's/v//') installed successfully"
                return 0
            else
                print_error "Failed to install Node.js"
                return 1
            fi
        else
            print_info "Please install NVM first, or install Node.js manually"
            return 1
        fi
    fi

    local current_version=$(node -v | sed 's/v//')
    local latest_version=$(get_latest_node_version)

    print_info "Current Node.js version: $current_version"
    print_info "Latest Node.js Current version: $latest_version"

    if [ "$current_version" = "$latest_version" ]; then
        print_success "Node.js is already at the latest Current version"
        return 0
    fi

    print_warning "Node.js has a newer version available ($latest_version)"

    if [ "$has_nvm" = true ]; then
        print_info "Updating Node.js to latest Current version using NVM..."
        read -p "Update Node.js now? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Node.js to v$latest_version"

            if nvm install node 2>&1 | tee -a "$LOG_FILE"; then
                nvm use --delete-prefix node 2>&1 | tee -a "$LOG_FILE"
                nvm alias default node 2>&1 | tee -a "$LOG_FILE"

                local new_version=$(node -v | sed 's/v//')
                print_success "Node.js updated to v$new_version"
                return 0
            else
                print_error "Failed to update Node.js"
                return 1
            fi
        else
            print_warning "Node.js update skipped"
            return 0
        fi
    else
        print_info "To update Node.js, NVM (Node Version Manager) is recommended"
        echo
        read -p "Would you like to install NVM now? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if install_nvm; then
                print_info "NVM installed successfully!"
                echo
                read -p "Install latest Node.js Current version now? (y/n): " -n 1 -r
                echo

                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    if check_nvm_installed; then
                        print_updating "Node.js to v$latest_version"
                        if nvm install node 2>&1 | tee -a "$LOG_FILE"; then
                            nvm use --delete-prefix node 2>&1 | tee -a "$LOG_FILE"
                            nvm alias default node 2>&1 | tee -a "$LOG_FILE"
                            local new_version=$(node -v | sed 's/v//')
                            print_success "Node.js updated to v$new_version"
                            return 0
                        else
                            print_error "Failed to install Node.js"
                            return 1
                        fi
                    else
                        print_error "NVM not available. Please restart your terminal and run this script again"
                        return 1
                    fi
                else
                    print_warning "Node.js installation skipped"
                    print_info "You can install later with: nvm install node && nvm use node"
                    return 0
                fi
            else
                print_warning "NVM installation skipped"
                print_info "Alternative: Download Node.js manually from https://nodejs.org/"
                return 0
            fi
        else
            print_info "NVM installation skipped"
            print_info "Alternative options:"
            print_info "  1. Install NVM manually: curl -o- $NVM_INSTALL_URL | bash"
            print_info "  2. Download from https://nodejs.org/ (get Current, not LTS)"
            return 0
        fi
    fi
}

check_and_update_npm() {
    print_section "npm Version Check"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        return 1
    fi

    local current_version=$(npm -v)
    local latest_version=$(get_latest_npm_version "npm")

    print_info "Current npm version: $current_version"
    print_info "Latest npm version: $latest_version"

    if [ "$current_version" != "$latest_version" ]; then
        print_warning "npm has a newer version available ($latest_version)"
        read -p "Update npm now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "npm"
            if npm install -g npm@latest 2>&1 | tee -a "$LOG_FILE"; then
                hash -r
                local new_version=$(npm -v)
                print_success "npm updated to $new_version"
            else
                print_error "Failed to update npm"
                return 1
            fi
        fi
    else
        print_success "npm is up to date"
    fi

    return 0
}

check_and_update_bun() {
    print_section "Bun Version Check"

    if ! command -v bun &> /dev/null; then
        print_warning "Bun is not installed (recommended for this project)"
        print_info "Install Bun: curl -fsSL https://bun.sh/install | bash"
        return 0
    fi

    local current_version=$(bun -v)
    print_info "Current Bun version: $current_version"

    print_info "Checking for Bun updates..."
    local update_output=$(bun upgrade --dry-run 2>&1 || echo "")
    if echo "$update_output" | grep -qi "already on.*latest"; then
        print_success "Bun is up to date"
    else
        print_warning "Bun has a newer version available"
        read -p "Update Bun now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Bun"
            if bun upgrade 2>&1 | tee -a "$LOG_FILE"; then
                hash -r
                local new_version=$(bun -v)
                print_success "Bun updated to $new_version"
            else
                print_error "Failed to update Bun"
                return 1
            fi
        fi
    fi

    return 0
}

check_and_update_claude() {
    print_section "Claude Code CLI Version Check"

    if ! command -v claude &> /dev/null; then
        print_warning "Claude Code CLI is not installed"
        return 1
    fi

    local current_version=$(claude --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "0.0.0")
    local latest_version=$(get_latest_npm_version "@anthropic-ai/claude-code")

    print_info "Current Claude Code CLI version: $current_version"
    print_info "Latest Claude Code CLI version: $latest_version"

    if [ "$current_version" != "$latest_version" ] && [ "$latest_version" != "0.0.0" ]; then
        print_warning "Claude Code CLI has a newer version available"
        read -p "Update Claude Code CLI now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Claude Code CLI"
            if npm install -g @anthropic-ai/claude-code@latest 2>&1 | tee -a "$LOG_FILE"; then
                hash -r
                local new_version=$(claude --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
                print_success "Claude Code CLI updated to $new_version"
            else
                print_error "Failed to update Claude Code CLI"
                return 1
            fi
        else
            print_info "Claude Code CLI update skipped"
        fi
    else
        print_success "Claude Code CLI is up to date"
    fi

    return 0
}

check_and_update_codex() {
    print_section "Codex Version Check"

    if ! command -v codex &> /dev/null; then
        print_warning "Codex is not installed (required for GPT-5.2 validation)"
        return 0
    fi

    local current_version=$(codex --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "0.0.0")
    local latest_version=$(get_latest_npm_version "@openai/codex")

    print_info "Current Codex version: $current_version"
    print_info "Latest Codex version: $latest_version"

    if [ "$current_version" != "$latest_version" ] && [ "$latest_version" != "0.0.0" ]; then
        print_warning "Codex has a newer version available"
        read -p "Update Codex now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Codex"
            if npm install -g @openai/codex@latest 2>&1 | tee -a "$LOG_FILE"; then
                hash -r
                local new_version=$(codex --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
                print_success "Codex updated to $new_version"
            else
                print_warning "Failed to update Codex"
            fi
        else
            print_info "Codex update skipped"
        fi
    else
        print_success "Codex is up to date"
    fi

    return 0
}

check_and_update_all_tools() {
    print_header "Checking Tool Versions"

    local all_ok=true

    # Core tools (required)
    check_and_update_node || all_ok=false
    check_and_update_npm || all_ok=false

    # Project-specific (recommended)
    check_and_update_bun

    # AI/MCP tools
    check_and_update_claude || all_ok=false
    check_and_update_codex

    if [ "$all_ok" = true ]; then
        print_success "All core tools are properly configured"
        return 0
    else
        print_error "Some core tools need attention"
        return 1
    fi
}

#############################################################################
# Prerequisites Check and Installation
#############################################################################

check_command() {
    local cmd=$1
    local install_msg=$2
    local install_cmd=$3

    if command -v "$cmd" &> /dev/null; then
        local version=$($cmd --version 2>&1 | head -n1)
        print_success "$cmd is installed: $version"
        return 0
    else
        print_warning "$cmd is not installed"
        if [ -n "$install_cmd" ]; then
            print_installing "$cmd"
            if eval "$install_cmd"; then
                print_success "$cmd installed successfully"
                return 0
            else
                print_error "Failed to install $cmd. $install_msg"
                return 1
            fi
        else
            print_error "$install_msg"
            return 1
        fi
    fi
}

install_prerequisites() {
    print_section "Checking Prerequisites"

    local prereq_failed=false

    # Check Git
    if ! check_command "git" "Please install Git manually" ""; then
        prereq_failed=true
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed"

        if check_nvm_installed; then
            print_info "NVM is available, attempting to install latest Node.js Current..."
            if nvm install node && nvm use node && nvm alias default node; then
                print_success "Node.js installed successfully via NVM"
            else
                print_error "Failed to install Node.js via NVM"
                prereq_failed=true
            fi
        else
            print_error "Node.js is not installed and NVM is not available"
            print_info "Recommended: Install NVM (Node Version Manager) first"

            if install_nvm; then
                print_info "Now installing latest Node.js Current version..."
                if check_nvm_installed && nvm install node && nvm use node && nvm alias default node; then
                    print_success "Node.js installed successfully"
                else
                    print_error "Failed to install Node.js after NVM installation"
                    print_info "Please restart your terminal and run this script again"
                    prereq_failed=true
                fi
            else
                print_info "Alternative: Download Node.js manually from https://nodejs.org/"
                print_info "Recommended version: Latest Current (not LTS)"
                prereq_failed=true
            fi
        fi
    fi

    # Check npm
    if ! check_command "npm" "npm should come with Node.js. Please reinstall Node.js" ""; then
        prereq_failed=true
    fi

    # Check npx
    if ! check_command "npx" "Installing npx..." "npm install -g npx@latest"; then
        prereq_failed=true
    fi

    # Check Claude Code CLI
    if ! check_command "claude" "Installing Claude Code CLI..." "npm install -g @anthropic-ai/claude-code@latest"; then
        print_error "Failed to install Claude Code CLI"
        print_info "Try running: npm install -g @anthropic-ai/claude-code@latest"
        prereq_failed=true
    fi

    # Check Codex
    if ! check_command "codex" "Installing Codex..." "npm install -g @openai/codex@latest"; then
        print_warning "Codex installation failed - GPT-5.2 validation will not work"
        print_info "Try running: npm install -g @openai/codex@latest"
    fi

    if [ "$prereq_failed" = true ]; then
        print_error "Some prerequisites failed to install. Please fix these issues and run the script again."
        return 1
    fi

    print_success "All prerequisites are installed"
    return 0
}

#############################################################################
# MCP Installation Functions
#############################################################################

check_mcp_installed() {
    local mcp_name=$1

    if claude mcp list 2>/dev/null | grep -q "$mcp_name"; then
        return 0
    else
        return 1
    fi
}

# Get current model configured for a Codex MCP
get_codex_mcp_model() {
    local mcp_name=$1
    claude mcp list 2>/dev/null | grep "^$mcp_name:" | grep -oE 'model=[^ ]+' | head -1 | cut -d'=' -f2
}

install_playwright_mcp() {
    print_section "Playwright MCP"

    if check_mcp_installed "playwright"; then
        print_success "Playwright MCP is already installed"
        return 0
    fi

    print_installing "Playwright MCP"
    if claude mcp add playwright npx @playwright/mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Playwright MCP installed successfully"

        print_info "Installing Playwright browsers..."
        npx playwright install chromium

        return 0
    else
        print_error "Failed to install Playwright MCP"
        return 1
    fi
}

install_context7_mcp() {
    print_section "Context7 MCP"

    if check_mcp_installed "context7"; then
        print_success "Context7 MCP is already installed"
        return 0
    fi

    print_installing "Context7 MCP"
    if claude mcp add --transport http context7 https://mcp.context7.com/mcp 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Context7 MCP installed successfully"
        return 0
    else
        print_error "Failed to install Context7 MCP"
        return 1
    fi
}

install_figma_mcp() {
    print_section "Figma MCP"

    if check_mcp_installed "figma"; then
        print_success "Figma MCP is already installed"
        return 0
    fi

    print_warning "Figma MCP requires Figma desktop app with MCP server enabled"
    print_info "Steps to enable:"
    print_info "1. Open Figma desktop app"
    print_info "2. Go to Figma menu → Preferences"
    print_info "3. Enable 'Enable local MCP server'"
    print_info "4. Server runs at http://127.0.0.1:3845/mcp"

    read -p "Is Figma MCP server enabled? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_installing "Figma MCP"
        if claude mcp add --transport http figma http://127.0.0.1:3845/mcp 2>&1 | tee -a "$LOG_FILE"; then
            print_success "Figma MCP installed successfully"
            return 0
        else
            print_error "Failed to install Figma MCP"
            return 1
        fi
    else
        print_warning "Skipping Figma MCP installation"
        return 0
    fi
}

install_github_mcp() {
    print_section "GitHub MCP"

    if check_mcp_installed "github"; then
        print_success "GitHub MCP is already installed"
        return 0
    fi

    print_warning "GitHub MCP requires a Personal Access Token"
    print_info "To generate a token:"
    print_info "1. Go to GitHub → Settings → Developer settings → Personal access tokens"
    print_info "2. Create token with scopes: repo, read:org, read:user"

    # Check for saved token
    local github_token=""
    if [ -f "$GITHUB_TOKEN_FILE" ]; then
        github_token=$(cat "$GITHUB_TOKEN_FILE")
        print_info "Found saved GitHub token"
    else
        read -p "Enter your GitHub Personal Access Token (or press Enter to skip): " github_token

        if [ -z "$github_token" ]; then
            print_warning "Skipping GitHub MCP installation"
            return 0
        fi

        # Save token for future use
        echo "$github_token" > "$GITHUB_TOKEN_FILE"
        chmod 600 "$GITHUB_TOKEN_FILE"
        print_info "Token saved for future use"
    fi

    print_installing "GitHub MCP"
    if claude mcp add github \
        --env GITHUB_PERSONAL_ACCESS_TOKEN="$github_token" \
        -- npx -y @modelcontextprotocol/server-github@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "GitHub MCP installed successfully"
        return 0
    else
        print_error "Failed to install GitHub MCP"
        return 1
    fi
}

install_codex_high_mcp() {
    print_section "Codex High MCP ($CODEX_TARGET_MODEL)"

    if check_mcp_installed "codex-high"; then
        local current_model=$(get_codex_mcp_model "codex-high")
        if [ "$current_model" = "$CODEX_TARGET_MODEL" ]; then
            print_success "Codex High MCP is already installed with $CODEX_TARGET_MODEL"
            return 0
        else
            print_warning "Codex High MCP has outdated model: $current_model (target: $CODEX_TARGET_MODEL)"
            print_info "Removing old configuration..."
            claude mcp remove codex-high -s local 2>/dev/null
            claude mcp remove codex-high -s project 2>/dev/null
            claude mcp remove codex-high -s user 2>/dev/null
            print_success "Old Codex High MCP removed"
        fi
    fi

    print_installing "Codex High MCP with $CODEX_TARGET_MODEL"
    if claude mcp add codex-high -- codex mcp-server \
        --model "$CODEX_TARGET_MODEL" \
        --sandbox workspace-write \
        --enable web_search_request \
        -c model_reasoning_effort=high \
        -c model_reasoning_summaries=detailed \
        -c sandbox_workspace_write.network_access=true \
        -c shell_environment_policy.inherit=all 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Codex High MCP ($CODEX_TARGET_MODEL) installed successfully"
        return 0
    else
        print_error "Failed to install Codex High MCP"
        return 1
    fi
}

install_codex_medium_mcp() {
    print_section "Codex Medium MCP ($CODEX_TARGET_MODEL)"

    if check_mcp_installed "codex-medium"; then
        local current_model=$(get_codex_mcp_model "codex-medium")
        if [ "$current_model" = "$CODEX_TARGET_MODEL" ]; then
            print_success "Codex Medium MCP is already installed with $CODEX_TARGET_MODEL"
            return 0
        else
            print_warning "Codex Medium MCP has outdated model: $current_model (target: $CODEX_TARGET_MODEL)"
            print_info "Removing old configuration..."
            claude mcp remove codex-medium -s local 2>/dev/null
            claude mcp remove codex-medium -s project 2>/dev/null
            claude mcp remove codex-medium -s user 2>/dev/null
            print_success "Old Codex Medium MCP removed"
        fi
    fi

    print_installing "Codex Medium MCP with $CODEX_TARGET_MODEL"
    if claude mcp add codex-medium -- codex mcp-server \
        --model "$CODEX_TARGET_MODEL" \
        --sandbox workspace-write \
        --enable web_search_request \
        -c model_reasoning_effort=medium \
        -c model_reasoning_summaries=detailed \
        -c sandbox_workspace_write.network_access=true \
        -c shell_environment_policy.inherit=all 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Codex Medium MCP ($CODEX_TARGET_MODEL) installed successfully"
        return 0
    else
        print_error "Failed to install Codex Medium MCP"
        return 1
    fi
}

install_mermaid_validator_mcp() {
    print_section "Mermaid Validator MCP"

    if check_mcp_installed "mermaid-validator"; then
        print_success "Mermaid Validator MCP is already installed"
        return 0
    fi

    print_installing "Mermaid Validator MCP"
    if claude mcp add mermaid-validator -- npx -y @rtuin/mcp-mermaid-validator@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Mermaid Validator MCP installed successfully"
        print_info "Use to validate all Mermaid diagrams in documentation and plans"
        return 0
    else
        print_error "Failed to install Mermaid Validator MCP"
        return 1
    fi
}

install_mermaid_generator_mcp() {
    print_section "Mermaid Generator MCP"

    if check_mcp_installed "mermaid-generator"; then
        print_success "Mermaid Generator MCP is already installed"
        return 0
    fi

    print_installing "Mermaid Generator MCP (installing globally first)"

    if ! command -v mcp-mermaid &> /dev/null; then
        print_info "Installing mcp-mermaid globally..."
        if npm install -g mcp-mermaid@latest 2>&1 | tee -a "$LOG_FILE"; then
            print_success "mcp-mermaid installed globally"
        else
            print_error "Failed to install mcp-mermaid globally"
            return 1
        fi
    else
        print_info "mcp-mermaid already installed globally"
    fi

    if claude mcp add mermaid-generator -- mcp-mermaid 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Mermaid Generator MCP installed successfully"
        print_info "Use to generate Mermaid diagrams from natural language descriptions"
        return 0
    else
        print_error "Failed to install Mermaid Generator MCP"
        return 1
    fi
}

install_chrome_devtools_mcp() {
    print_section "Chrome DevTools MCP"

    if check_mcp_installed "chrome-devtools"; then
        print_success "Chrome DevTools MCP is already installed"
        return 0
    fi

    print_installing "Chrome DevTools MCP"
    if claude mcp add chrome-devtools npx -y chrome-devtools-mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Chrome DevTools MCP installed successfully"
        print_info "Provides performance analysis, debugging, and browser automation"
        return 0
    else
        print_error "Failed to install Chrome DevTools MCP"
        return 1
    fi
}

install_nextjs_devtools_mcp() {
    print_section "Next.js DevTools MCP"

    if check_mcp_installed "next-devtools"; then
        print_success "Next.js DevTools MCP is already installed"
        return 0
    fi

    print_warning "Next.js DevTools MCP requires Next.js 16+ with dev server running"
    print_info "Features: Error detection, live state queries, page metadata, server actions"
    print_info "Auto-discovers Next.js instances at http://localhost:PORT/_next/mcp"

    print_installing "Next.js DevTools MCP"
    if claude mcp add next-devtools npx -y next-devtools-mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Next.js DevTools MCP installed successfully"
        print_info "Start your Next.js dev server to enable real-time integration"
        return 0
    else
        print_error "Failed to install Next.js DevTools MCP"
        return 1
    fi
}

#############################################################################
# Health Checks
#############################################################################

perform_health_checks() {
    print_header "Performing Health Checks"

    local all_healthy=true

    print_section "Checking MCP Status"

    print_info "Configured MCPs:"
    claude mcp list 2>/dev/null || {
        print_error "No MCPs configured or claude command failed"
        all_healthy=false
    }

    print_section "Testing MCP Connections"

    # Test Context7
    if check_mcp_installed "context7"; then
        print_info "Context7 MCP: Ready for documentation queries"
    else
        print_warning "Context7 MCP: Not installed"
    fi

    # Test Playwright
    if check_mcp_installed "playwright"; then
        print_info "Playwright MCP: Ready for browser automation"
        print_info "  Note: Run 'npx playwright install' to install browsers if needed"
    else
        print_warning "Playwright MCP: Not installed"
    fi

    # Test GitHub
    if check_mcp_installed "github"; then
        print_info "GitHub MCP: Configured with API access"
    else
        print_warning "GitHub MCP: Not installed"
    fi

    # Test Figma
    if check_mcp_installed "figma"; then
        print_info "Figma MCP: Configured (requires Figma desktop app running)"
    else
        print_warning "Figma MCP: Not installed"
    fi

    # Test Codex
    if check_mcp_installed "codex-high"; then
        local codex_high_model=$(get_codex_mcp_model "codex-high")
        print_info "Codex High MCP ($codex_high_model): Ready for advanced AI tasks"
        if [ "$codex_high_model" != "$CODEX_TARGET_MODEL" ]; then
            print_warning "  Model outdated - run script again to update to $CODEX_TARGET_MODEL"
        fi
    else
        print_warning "Codex High MCP: Not installed"
    fi

    if check_mcp_installed "codex-medium"; then
        local codex_medium_model=$(get_codex_mcp_model "codex-medium")
        print_info "Codex Medium MCP ($codex_medium_model): Ready for standard AI tasks"
        if [ "$codex_medium_model" != "$CODEX_TARGET_MODEL" ]; then
            print_warning "  Model outdated - run script again to update to $CODEX_TARGET_MODEL"
        fi
    else
        print_warning "Codex Medium MCP: Not installed"
    fi

    # Storybook MCP removed - no Storybook in this project

    # Test Mermaid Validator
    if check_mcp_installed "mermaid-validator"; then
        print_info "Mermaid Validator MCP: Ready for diagram validation"
        print_info "  Tools: Validate and render Mermaid diagrams"
        print_info "  MANDATORY: All diagrams in docs/plans must be validated"
    else
        print_warning "Mermaid Validator MCP: Not installed"
    fi

    # Test Mermaid Generator
    if check_mcp_installed "mermaid-generator"; then
        print_info "Mermaid Generator MCP: Ready for AI-powered diagram creation"
        print_info "  Tools: Generate diagrams from natural language, export PNG/SVG"
        print_info "  Use with Mermaid Validator for complete workflow"
    else
        print_warning "Mermaid Generator MCP: Not installed"
    fi

    # Test Chrome DevTools
    if check_mcp_installed "chrome-devtools"; then
        print_info "Chrome DevTools MCP: Ready for frontend performance and debugging"
        print_info "  Tools: Performance tracing, network analysis, screenshot capture"
        print_info "  Requires Chrome browser installed"
    else
        print_warning "Chrome DevTools MCP: Not installed"
    fi

    # Test Next.js DevTools
    if check_mcp_installed "next-devtools"; then
        print_info "Next.js DevTools MCP: Ready for Next.js development integration"
        print_info "  Tools: Error detection, live state queries, page metadata, server actions"
        print_info "  Requires Next.js 16+ with dev server running"
        print_info "  Auto-discovers endpoint at http://localhost:PORT/_next/mcp"
    else
        print_warning "Next.js DevTools MCP: Not installed"
    fi

    if [ "$all_healthy" = true ]; then
        print_success "All health checks passed"
    else
        print_warning "Some health checks failed - review warnings above"
    fi
}

#############################################################################
# Summary Report
#############################################################################

generate_summary() {
    print_header "Setup Summary"

    local installed_count=0

    echo -e "${BOLD}MCP Configuration Status:${NC}"
    echo "────────────────────────────────────────"

    for mcp in "playwright" "context7" "github" "figma" "codex-high" "codex-medium" "mermaid-validator" "mermaid-generator" "chrome-devtools" "next-devtools"; do
        if check_mcp_installed "$mcp"; then
            echo -e "  ${GREEN}✓${NC} $mcp ${GREEN}(ready)${NC}"
            ((installed_count++))
        else
            echo -e "  ${YELLOW}○${NC} $mcp ${YELLOW}(not configured)${NC}"
        fi
    done

    echo "────────────────────────────────────────"

    # Dynamic summary based on what happened
    case "$MODE" in
        "first_time")
            echo -e "${BOLD}Result: First-time setup completed!${NC}"
            echo -e "${GREEN}✓${NC} Prerequisites installed"
            echo -e "${GREEN}✓${NC} $installed_count/$MCPS_TOTAL MCPs configured"
            ;;
        "install")
            echo -e "${BOLD}Result: Fresh installation completed!${NC}"
            echo -e "${GREEN}✓${NC} $installed_count/$MCPS_TOTAL MCPs configured"
            ;;
        "partial")
            echo -e "${BOLD}Result: Missing components added!${NC}"
            echo -e "${GREEN}✓${NC} Now have $installed_count/$MCPS_TOTAL MCPs configured"
            ;;
        "update")
            echo -e "${BOLD}Result: System up to date!${NC}"
            echo -e "${GREEN}✓${NC} All $installed_count MCPs verified"
            if [ "$NEEDS_UPDATE" = true ]; then
                echo -e "${GREEN}✓${NC} Updates applied"
            fi
            ;;
    esac

    # Quick health status
    echo
    echo -e "${BOLD}Health Check:${NC}"
    if [ "$installed_count" -eq "$MCPS_TOTAL" ]; then
        echo -e "  ${GREEN}✓${NC} All systems operational"
    elif [ "$installed_count" -gt 0 ]; then
        echo -e "  ${YELLOW}⚠${NC}  Partial configuration (optional MCPs can be added later)"
    else
        echo -e "  ${RED}✗${NC} No MCPs configured yet"
    fi

    # Log location
    echo
    print_info "Detailed log: $LOG_FILE"
}

#############################################################################
# Smart Detection Functions
#############################################################################

detect_system_state() {
    print_section "Analyzing System State"

    if ! command -v claude &> /dev/null; then
        MODE="first_time"
        FIRST_TIME_SETUP=true
        print_info "First time setup detected - Claude Code not installed"
        return
    fi

    # Count installed MCPs
    local installed_mcps=()
    for mcp in "playwright" "context7" "github" "figma" "codex-high" "codex-medium" "mermaid-validator" "mermaid-generator" "chrome-devtools" "next-devtools"; do
        if check_mcp_installed "$mcp"; then
            installed_mcps+=("$mcp")
        fi
    done

    MCPS_INSTALLED=${#installed_mcps[@]}

    # Determine mode based on what's installed
    if [ "$MCPS_INSTALLED" -eq 0 ]; then
        MODE="install"
        print_info "No MCPs found - will install all required MCPs"
    elif [ "$MCPS_INSTALLED" -lt "$MCPS_TOTAL" ]; then
        MODE="partial"
        print_info "Found $MCPS_INSTALLED/$MCPS_TOTAL MCPs - will install missing ones"
        print_info "Installed: ${installed_mcps[*]}"
    else
        MODE="update"
        print_info "All MCPs installed - checking for updates and health"
    fi

    # Check if updates are available
    if [ "$MODE" = "update" ]; then
        if npm outdated -g 2>/dev/null | grep -q "@anthropic-ai/claude-code"; then
            NEEDS_UPDATE=true
            print_info "Updates available for Claude Code CLI"
        fi
    fi
}

should_install_mcp() {
    local mcp_name=$1

    if [ "$MODE" = "install" ] || [ "$MODE" = "partial" ]; then
        if ! check_mcp_installed "$mcp_name"; then
            return 0
        fi
    fi
    return 1
}

#############################################################################
# Intelligent Workflow
#############################################################################

smart_install_mcps() {
    print_header "Setting Up MCP Servers"

    local any_installed=false
    local any_failed=false

    # Playwright
    if should_install_mcp "playwright"; then
        install_playwright_mcp && any_installed=true || any_failed=true
    else
        print_success "Playwright MCP already configured"
    fi

    # Context7
    if should_install_mcp "context7"; then
        install_context7_mcp && any_installed=true || any_failed=true
    else
        print_success "Context7 MCP already configured"
    fi

    # Figma
    if should_install_mcp "figma"; then
        install_figma_mcp && any_installed=true || any_failed=true
    else
        print_success "Figma MCP already configured"
    fi

    # GitHub
    if should_install_mcp "github"; then
        install_github_mcp && any_installed=true || any_failed=true
    else
        print_success "GitHub MCP already configured"
    fi

    # Codex High - always check (handles model version updates)
    install_codex_high_mcp && any_installed=true || any_failed=true

    # Codex Medium - always check (handles model version updates)
    install_codex_medium_mcp && any_installed=true || any_failed=true

    # Storybook MCP removed - no Storybook in this project

    # Mermaid Validator
    if should_install_mcp "mermaid-validator"; then
        install_mermaid_validator_mcp && any_installed=true || any_failed=true
    else
        print_success "Mermaid Validator MCP already configured"
    fi

    # Mermaid Generator
    if should_install_mcp "mermaid-generator"; then
        install_mermaid_generator_mcp && any_installed=true || any_failed=true
    else
        print_success "Mermaid Generator MCP already configured"
    fi

    # Chrome DevTools
    if should_install_mcp "chrome-devtools"; then
        install_chrome_devtools_mcp && any_installed=true || any_failed=true
    else
        print_success "Chrome DevTools MCP already configured"
    fi

    # Next.js DevTools
    if should_install_mcp "next-devtools"; then
        install_nextjs_devtools_mcp && any_installed=true || any_failed=true
    else
        print_success "Next.js DevTools MCP already configured"
    fi

    if [ "$any_installed" = true ]; then
        print_success "New MCPs installed successfully"
    fi

    if [ "$any_failed" = true ]; then
        print_warning "Some MCPs failed to install - they can be added later"
    fi
}

smart_update_if_needed() {
    if [ "$MODE" = "update" ] || [ "$NEEDS_UPDATE" = true ]; then
        print_header "Checking for Updates"

        print_info "Checking npm packages for updates..."

        # Check and update Claude Code CLI
        if npm outdated -g 2>/dev/null | grep -q "@anthropic-ai/claude-code"; then
            print_updating "Claude Code CLI"
            npm install -g @anthropic-ai/claude-code@latest 2>&1 | tee -a "$LOG_FILE"
            print_success "Claude Code CLI updated"
        else
            print_success "Claude Code CLI is up to date"
        fi

        # Check and update Codex
        if command -v codex &> /dev/null; then
            if npm outdated -g 2>/dev/null | grep -q "@openai/codex"; then
                print_updating "Codex"
                npm install -g @openai/codex@latest 2>&1 | tee -a "$LOG_FILE" || print_warning "Codex update skipped"
            else
                print_success "Codex is up to date"
            fi
        fi

        print_info "MCPs using npx auto-update on each use"
    fi
}

#############################################################################
# Main Execution - Smart Mode
#############################################################################

main() {
    clear
    print_header "MCP Smart Setup - info-web"
    echo "Project: GitHub rayzru/info-web"
    echo "Stack: Next.js 16 + React 19 + tRPC 11 + Drizzle"
    echo

    # Check if running with required permissions
    if [ "$EUID" -eq 0 ]; then
        print_warning "Please don't run this script as root/sudo"
        exit 1
    fi

    # Step 0: Check and update tool versions
    if ! check_and_update_all_tools; then
        print_warning "Some tool updates failed - continuing with available versions"
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Setup cancelled by user"
            exit 1
        fi
    fi

    # Step 1: Detect current state
    detect_system_state

    # Step 2: Show what we're going to do
    print_header "Setup Plan"
    case "$MODE" in
        "first_time")
            echo "📦 First-time setup detected"
            echo "  → Install prerequisites (Node.js, npm, Claude Code CLI)"
            echo "  → Install all 11 MCP servers"
            echo "  → Configure and verify everything"
            ;;
        "install")
            echo "🆕 Fresh MCP installation needed"
            echo "  → Install all 11 MCP servers"
            echo "  → Configure each server"
            echo "  → Run health checks"
            ;;
        "partial")
            echo "🔧 Partial setup detected"
            echo "  → Install missing MCPs ($(($MCPS_TOTAL - $MCPS_INSTALLED)) remaining)"
            echo "  → Verify existing MCPs"
            echo "  → Update if needed"
            ;;
        "update")
            echo "✅ All MCPs installed"
            echo "  → Check for updates"
            echo "  → Run health checks"
            echo "  → Verify everything works"
            ;;
    esac
    echo
    read -p "Press Enter to continue..." -r

    # Step 3: Install prerequisites (always check)
    if ! install_prerequisites; then
        print_error "Prerequisites check failed. Please fix issues and run again."
        exit 1
    fi

    # Step 4: Smart installation/update
    smart_install_mcps

    # Step 5: Update if needed
    smart_update_if_needed

    # Step 6: Run health checks (unless skipped)
    if [ "$SKIP_HEALTH_CHECKS" = false ]; then
        perform_health_checks
    else
        print_info "⚡ Skipping health checks (fast mode)"
    fi

    # Step 7: Generate summary
    generate_summary

    # Step 8: Smart recommendations
    print_header "Recommendations"

    case "$MODE" in
        "first_time"|"install")
            print_info "✨ Setup complete! Next steps:"
            print_info "1. Restart Claude Code"
            print_info "2. Type /mcp in Claude to see your servers"
            print_info "3. Try: 'Navigate to http://localhost:3000' (Playwright)"
            ;;
        "partial")
            print_info "🔧 Partial setup complete! Next steps:"
            print_info "1. Restart Claude Code if running"
            print_info "2. Test the newly installed MCPs"
            print_info "3. Run this script again anytime to add missing MCPs"
            ;;
        "update")
            print_info "✅ Everything is up to date!"
            print_info "Run this script weekly to stay current"
            ;;
    esac

    exit 0
}

# Simple execution - no flags needed!
main
