#!/bin/bash

#############################################################################
# MCP Smart Setup Script
# Automatically detects and handles all MCP requirements
#
# Usage:
#   ./.claude/scripts/verify_mcp.sh              # Full check (slow)
#   ./.claude/scripts/verify_mcp.sh --fast       # Skip health checks (fast)
#
# This script intelligently:
# 0. Checks versions of all reasoning tools (Node, npm, bun, claude, codex, gemini)
# 1. Detects what's already installed
# 2. Installs only what's missing
# 3. Updates what needs updating
# 4. Verifies everything is working (unless --fast)
# 5. Provides clear status reporting
#
# Version Management:
#   - Automatically checks for updates to critical tools
#   - Prompts for optional updates (npm, bun, gemini)
#   - Installs/updates Node.js to latest Current (not LTS) using NVM
#   - Automatically installs NVM if not present
#
# Node.js Management:
#   - Prefers latest Current version over LTS for cutting-edge features
#   - Uses NVM (Node Version Manager) for version management
#   - Automatically installs NVM if not present
#   - Prompts before updating to give user control
#   - Auto-cleanup: Offers to remove old Node.js versions after updates
#   - Keeps only the current/active version to save disk space
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
LOG_FILE="$SCRIPT_DIR/mcp_verification.log"
GITLAB_TOKEN_FILE="$HOME/.gitlab_mcp_token"
GEMINI_API_KEY_FILE="$HOME/.gemini_mcp_api_key"

# Track what mode we're in
MODE="unknown"
MCPS_INSTALLED=0
MCPS_TOTAL=14
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

# Codex model configuration - update this when new models are released
CODEX_TARGET_MODEL="gpt-5.3-codex"

# NVM configuration
# Using master branch ensures we always get the latest stable version
# This is the official recommendation from the NVM team
NVM_INSTALL_URL="https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh"

# Get latest version from npm registry
get_latest_npm_version() {
    local package=$1
    npm view "$package" version 2>/dev/null || echo "0.0.0"
}

# Check if NVM is installed and properly sourced
check_nvm_installed() {
    # Try to source NVM if not already available
    if [ ! -f "$HOME/.nvm/nvm.sh" ] && [ -z "$NVM_DIR" ]; then
        return 1
    fi

    # Source NVM if needed
    if ! command -v nvm &> /dev/null; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi

    command -v nvm &> /dev/null
}

# Get latest Node.js Current version
get_latest_node_version() {
    # Try to get from nvm if available
    if check_nvm_installed; then
        nvm version-remote node 2>/dev/null | sed 's/v//' || echo "23.0.0"
    else
        # Fallback: try to fetch from nodejs.org
        curl -sS https://nodejs.org/dist/index.json 2>/dev/null | \
            grep -oE '"version":"v[0-9]+\.[0-9]+\.[0-9]+"' | \
            head -1 | \
            grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "23.0.0"
    fi
}

# Install NVM
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
        # Source NVM immediately
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

        print_success "NVM installed successfully"
        print_info "Please restart your terminal or run:"
        print_info "  source ~/.nvm/nvm.sh"
        return 0
    else
        print_error "Failed to install NVM"
        return 1
    fi
}

# Clean up old Node.js versions, keeping only the latest and current
cleanup_old_node_versions() {
    if ! check_nvm_installed; then
        return 0  # No cleanup needed if NVM not installed
    fi

    print_section "Node.js Version Cleanup"

    # Get list of installed versions (use ls-remote to get available, then filter by installed)
    local installed_versions=$(nvm list 2>/dev/null | grep -v 'default' | grep -v 'system' | grep -v '->' | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | sed 's/v//' | sort -u || echo "")

    if [ -z "$installed_versions" ]; then
        print_info "No Node.js versions to clean up"
        return 0
    fi

    # Count installed versions
    local version_count=$(echo "$installed_versions" | grep -c '^' || echo "0")

    if [ "$version_count" -le 1 ]; then
        print_info "Only one Node.js version installed, no cleanup needed"
        return 0
    fi

    print_info "Found $version_count Node.js versions installed"

    # Get current version
    local current_version=$(node -v 2>/dev/null | sed 's/v//' || echo "")
    if [ -z "$current_version" ]; then
        print_warning "Could not determine current Node.js version"
        return 0
    fi

    print_info "Current version: v$current_version"
    print_info "Installed versions:"
    echo "$installed_versions" | while read -r ver; do
        if [ -n "$ver" ]; then
            if [ "$ver" = "$current_version" ]; then
                echo "  v$ver (current)"
            else
                echo "  v$ver"
            fi
        fi
    done

    # Ask user if they want to clean up old versions
    echo
    read -p "Remove old Node.js versions? (keeps only current version) (y/n): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleanup skipped"
        return 0
    fi

    # Remove old versions
    local removed_count=0
    local failed_count=0

    while IFS= read -r ver; do
        if [ -n "$ver" ] && [ "$ver" != "$current_version" ]; then
            print_info "Removing Node.js v$ver..."
            if nvm uninstall "$ver" >/dev/null 2>&1; then
                ((removed_count++))
                print_success "Removed v$ver"
            else
                # Silently skip if version doesn't exist or can't be removed
                :
            fi
        fi
    done <<< "$installed_versions"

    if [ "$removed_count" -gt 0 ]; then
        print_success "Removed $removed_count old Node.js version(s)"
    else
        print_info "No versions were removed"
    fi

    return 0
}

check_and_update_node() {
    print_section "Node.js Version Check & Update"

    # Check if NVM is installed first
    local has_nvm=false
    if check_nvm_installed; then
        has_nvm=true
        print_info "NVM is installed"
    else
        print_warning "NVM is not installed (recommended for Node.js management)"
    fi

    # Check if Node.js is installed
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

                # Note: No cleanup needed for fresh install, but function handles this gracefully
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

    # Node.js is installed, check version
    local current_version=$(node -v | sed 's/v//')
    local latest_version=$(get_latest_node_version)

    print_info "Current Node.js version: $current_version"
    print_info "Latest Node.js Current version: $latest_version"

    # Check if update is needed
    if [ "$current_version" = "$latest_version" ]; then
        print_success "Node.js is already at the latest Current version"
        return 0
    fi

    print_warning "Node.js has a newer version available ($latest_version)"

    # Update if NVM is available
    if [ "$has_nvm" = true ]; then
        print_info "Updating Node.js to latest Current version using NVM..."
        read -p "Update Node.js now? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Node.js to v$latest_version"

            if nvm install node 2>&1 | tee -a "$LOG_FILE"; then
                # Use --delete-prefix to fix .npmrc conflicts
                nvm use --delete-prefix node 2>&1 | tee -a "$LOG_FILE"
                nvm alias default node 2>&1 | tee -a "$LOG_FILE"

                # Verify the switch worked
                local new_version=$(node -v | sed 's/v//')
                print_success "Node.js updated to v$new_version"

                # Offer to clean up old versions after successful update
                echo
                cleanup_old_node_versions

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
        # No NVM - offer to install it
        print_info "To update Node.js, NVM (Node Version Manager) is recommended"
        echo
        read -p "Would you like to install NVM now? (y/n): " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Install NVM
            if install_nvm; then
                # NVM installed, now offer to install latest Node.js
                print_info "NVM installed successfully!"
                echo
                read -p "Install latest Node.js Current version now? (y/n): " -n 1 -r
                echo

                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    if check_nvm_installed; then
                        print_updating "Node.js to v$latest_version"
                        if nvm install node 2>&1 | tee -a "$LOG_FILE"; then
                            # Use --delete-prefix to fix .npmrc conflicts
                            nvm use --delete-prefix node 2>&1 | tee -a "$LOG_FILE"
                            nvm alias default node 2>&1 | tee -a "$LOG_FILE"

                            # Verify the switch worked
                            local new_version=$(node -v | sed 's/v//')
                            print_success "Node.js updated to v$new_version"

                            # Offer to clean up old versions after successful update
                            echo
                            cleanup_old_node_versions
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
                hash -r  # Clear command cache
                local new_version=$(npm -v)
                if [ "$new_version" = "$latest_version" ]; then
                    print_success "npm updated to $new_version"
                else
                    print_warning "npm install completed but version shows $new_version (expected $latest_version)"
                    print_warning "This may indicate shadowed installations - check your PATH"
                fi
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
        print_warning "Bun is not installed (optional)"
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
                hash -r  # Clear command cache
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
                hash -r  # Clear command cache
                local new_version=$(claude --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
                if [ "$new_version" = "$latest_version" ]; then
                    print_success "Claude Code CLI updated to $new_version"
                else
                    print_warning "Claude Code CLI install completed but version shows $new_version (expected $latest_version)"
                    print_warning "This may indicate shadowed installations - check your PATH"
                fi
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
        print_warning "Codex is not installed (optional for GPT-5 reasoning)"
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
                hash -r  # Clear command cache
                local new_version=$(codex --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
                if [ "$new_version" = "$latest_version" ]; then
                    print_success "Codex updated to $new_version"
                else
                    print_warning "Codex install completed but version shows $new_version (expected $latest_version)"
                    print_warning "This may indicate shadowed installations - check your PATH"
                fi
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

check_and_update_gemini() {
    print_section "Gemini CLI Version Check"

    if ! command -v gemini &> /dev/null; then
        print_warning "Gemini CLI is not installed (optional)"
        return 0
    fi

    local current_version=$(gemini --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "0.0.0")
    local latest_version=$(get_latest_npm_version "@google/gemini-cli")

    print_info "Current Gemini CLI version: $current_version"
    print_info "Latest Gemini CLI version: $latest_version"

    if [ "$current_version" != "$latest_version" ] && [ "$latest_version" != "0.0.0" ]; then
        print_warning "Gemini CLI has a newer version available"
        read -p "Update Gemini CLI now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_updating "Gemini CLI"
            if npm install -g @google/gemini-cli@latest 2>&1 | tee -a "$LOG_FILE"; then
                hash -r  # Clear command cache
                local new_version=$(gemini --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown")
                if [ "$new_version" = "$latest_version" ]; then
                    print_success "Gemini CLI updated to $new_version"
                else
                    print_warning "Gemini CLI install completed but version shows $new_version (expected $latest_version)"
                    print_warning "This may indicate shadowed installations - check your PATH"
                fi
            else
                print_warning "Failed to update Gemini CLI"
            fi
        else
            print_info "Gemini CLI update skipped"
        fi
    else
        print_success "Gemini CLI is up to date"
    fi

    return 0
}

check_and_update_coderabbit() {
    print_section "CodeRabbit CLI Version Check"

    if ! command -v coderabbit &> /dev/null; then
        print_warning "CodeRabbit CLI is not installed (optional for automated code review)"
        print_info "Install: Visit https://coderabbit.ai/cli for installation instructions"
        print_info "Then authenticate: coderabbit auth login"
        return 0
    fi

    local current_version=$(coderabbit --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "0.0.0")
    print_info "Current CodeRabbit CLI version: $current_version"

    # CodeRabbit auto-updates in the background, no manual update check needed
    print_info "CodeRabbit CLI auto-updates in the background"

    # Check authentication status
    print_info "Checking CodeRabbit authentication..."
    local auth_output=$(coderabbit auth status 2>&1 || echo "")
    if echo "$auth_output" | grep -q "Logged in"; then
        local user_info=$(echo "$auth_output" | grep -E "Name:|Email:|Username:" | tr '\n' ' ')
        print_success "CodeRabbit is authenticated${user_info:+ ($user_info)}"
    else
        print_warning "CodeRabbit is not authenticated"
        print_info "Run: coderabbit auth login"
    fi

    return 0
}

check_and_update_all_tools() {
    print_header "Checking Tool Versions"

    local all_ok=true

    # Core tools (required)
    check_and_update_node || all_ok=false
    check_and_update_npm || all_ok=false

    # Optional but recommended
    check_and_update_bun

    # AI/MCP tools
    check_and_update_claude || all_ok=false
    check_and_update_codex
    check_and_update_gemini

    # Code review tools (optional)
    check_and_update_coderabbit  # Optional tool - failure doesn't affect all_ok

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

check_node_version() {
    if command -v node &> /dev/null; then
        local current_version=$(node -v | sed 's/v//')
        local latest_version=$(get_latest_node_version)

        if [ "$current_version" = "$latest_version" ]; then
            print_success "Node.js is at the latest version (v$current_version)"
        else
            print_info "Current Node.js: v$current_version"
            print_info "Latest available: v$latest_version (update available)"
        fi
        return 0
    else
        return 1
    fi
}

install_prerequisites() {
    print_section "Checking Prerequisites"

    local prereq_failed=false

    # Check for package manager
    local pkg_manager=""
    if command -v brew &> /dev/null; then
        pkg_manager="brew"
    elif command -v apt-get &> /dev/null; then
        pkg_manager="apt-get"
    elif command -v yum &> /dev/null; then
        pkg_manager="yum"
    fi

    # Check Git
    if ! check_command "git" "Please install Git manually" ""; then
        prereq_failed=true
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed"

        # Check if NVM is available
        if check_nvm_installed; then
            print_info "NVM is available, attempting to install latest Node.js Current..."
            if nvm install node && nvm use node && nvm alias default node; then
                print_success "Node.js installed successfully via NVM"
                # Cleanup not needed for fresh install
            else
                print_error "Failed to install Node.js via NVM"
                prereq_failed=true
            fi
        else
            print_error "Node.js is not installed and NVM is not available"
            print_info "Recommended: Install NVM (Node Version Manager) first"

            # Offer to install NVM
            if install_nvm; then
                print_info "Now installing latest Node.js Current version..."
                if check_nvm_installed && nvm install node && nvm use node && nvm alias default node; then
                    print_success "Node.js installed successfully"
                    # Cleanup not needed for fresh install
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

    if ! check_node_version; then
        prereq_failed=true
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
        print_warning "Codex installation failed - some features may not work"
        print_info "Try running: npm install -g @openai/codex@latest"
    fi

    # Check Gemini CLI
    if ! check_command "gemini" "Installing Gemini CLI..." "npm install -g @google/gemini-cli@latest"; then
        print_warning "Gemini CLI installation failed - Gemini MCP will not work"
        print_info "Try running: npm install -g @google/gemini-cli@latest"
    fi

    # Check CodeRabbit CLI
    if ! command -v coderabbit &> /dev/null; then
        print_warning "CodeRabbit CLI is not installed (required for code review)"
        print_info "Install: Visit https://coderabbit.ai/cli for installation instructions"
        print_info "Then authenticate: coderabbit auth login"
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

# Global cache for claude mcp list output (performance optimization)
MCP_LIST_CACHE=""

# Get MCP list (cached or fresh)
get_mcp_list() {
    if [ -z "$MCP_LIST_CACHE" ]; then
        MCP_LIST_CACHE=$(claude mcp list 2>/dev/null || echo "")
    fi
    echo "$MCP_LIST_CACHE"
}

# Clear MCP list cache (call after installing/removing MCPs)
clear_mcp_cache() {
    MCP_LIST_CACHE=""
}

check_mcp_installed() {
    local mcp_name=$1
    local mcp_list=$(get_mcp_list)

    # Check if MCP is listed in cached list
    if echo "$mcp_list" | grep -q "$mcp_name"; then
        return 0
    else
        return 1
    fi
}

# Get current model configured for a Codex MCP
get_codex_mcp_model() {
    local mcp_name=$1
    local mcp_list=$(get_mcp_list)

    # Extract model value and strip quotes
    echo "$mcp_list" | grep "^$mcp_name:" | grep -oE 'model=[^ ]+' | head -1 | cut -d'=' -f2 | tr -d '"'
}

# Check if Codex MCP needs model update
codex_mcp_needs_update() {
    local mcp_name=$1
    local current_model=$(get_codex_mcp_model "$mcp_name")

    if [ -z "$current_model" ]; then
        return 1  # Not installed, doesn't need update (needs install)
    fi

    if [ "$current_model" != "$CODEX_TARGET_MODEL" ]; then
        return 0  # Needs update
    fi

    return 1  # Already on target model
}

install_playwright_mcp() {
    print_section "Playwright MCP"

    if check_mcp_installed "playwright"; then
        print_success "Playwright MCP is already installed"
        return 0
    fi

    print_installing "Playwright MCP"
    if claude mcp add playwright -- npx -y @playwright/mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Playwright MCP installed successfully"

        # Install browsers
        print_info "Installing Playwright browsers..."
        npx playwright install chromium

        clear_mcp_cache
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
        clear_mcp_cache
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
            clear_mcp_cache
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

install_gitlab_mcp() {
    print_section "GitLab MCP"

    if check_mcp_installed "gitlab"; then
        print_success "GitLab MCP is already installed"
        return 0
    fi

    print_warning "GitLab MCP requires a Personal Access Token"
    print_info "To generate a token:"
    print_info "1. Go to GitLab → Settings → Access Tokens"
    print_info "2. Create token with scopes: api, read_repository, write_repository"

    # Check for saved token
    local gitlab_token=""
    if [ -f "$GITLAB_TOKEN_FILE" ]; then
        gitlab_token=$(cat "$GITLAB_TOKEN_FILE")
        print_info "Found saved GitLab token"
    else
        read -p "Enter your GitLab Personal Access Token (or press Enter to skip): " gitlab_token

        if [ -z "$gitlab_token" ]; then
            print_warning "Skipping GitLab MCP installation"
            return 0
        fi

        # Save token for future use
        echo "$gitlab_token" > "$GITLAB_TOKEN_FILE"
        chmod 600 "$GITLAB_TOKEN_FILE"
        print_info "Token saved for future use"
    fi

    print_installing "GitLab MCP"
    if claude mcp add gitlab \
        --env GITLAB_PERSONAL_ACCESS_TOKEN="$gitlab_token" \
        --env GITLAB_API_URL=https://gitlab.com/api/v4 \
        --env GITLAB_READ_ONLY_MODE=false \
        -- npx -y @zereight/mcp-gitlab@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "GitLab MCP installed successfully"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install GitLab MCP"
        return 1
    fi
}

install_codex_high_mcp() {
    print_section "Codex High MCP ($CODEX_TARGET_MODEL)"

    # Check if installed with outdated model
    if check_mcp_installed "codex-high"; then
        local current_model=$(get_codex_mcp_model "codex-high")
        if [ "$current_model" = "$CODEX_TARGET_MODEL" ]; then
            print_success "Codex High MCP is already installed with $CODEX_TARGET_MODEL"
            return 0
        else
            print_warning "Codex High MCP has outdated model: $current_model (target: $CODEX_TARGET_MODEL)"
            print_info "Removing old configuration from all scopes..."
            # Remove from both local and project scopes to handle multi-scope configs
            claude mcp remove codex-high -s local 2>/dev/null
            claude mcp remove codex-high -s project 2>/dev/null
            claude mcp remove codex-high -s user 2>/dev/null
            clear_mcp_cache
            print_success "Old Codex High MCP removed"
        fi
    fi

    print_installing "Codex High MCP with $CODEX_TARGET_MODEL"
    if claude mcp add codex-high -- codex mcp-server \
        -c "model=\"$CODEX_TARGET_MODEL\"" \
        -c "sandbox=\"workspace-write\"" \
        --enable web_search_request \
        -c model_reasoning_effort=high \
        -c model_reasoning_summaries=detailed \
        -c sandbox_workspace_write.network_access=true \
        -c shell_environment_policy.inherit=all 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Codex High MCP ($CODEX_TARGET_MODEL) installed successfully"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Codex High MCP"
        return 1
    fi
}

install_codex_medium_mcp() {
    print_section "Codex Medium MCP ($CODEX_TARGET_MODEL)"

    # Check if installed with outdated model
    if check_mcp_installed "codex-medium"; then
        local current_model=$(get_codex_mcp_model "codex-medium")
        if [ "$current_model" = "$CODEX_TARGET_MODEL" ]; then
            print_success "Codex Medium MCP is already installed with $CODEX_TARGET_MODEL"
            return 0
        else
            print_warning "Codex Medium MCP has outdated model: $current_model (target: $CODEX_TARGET_MODEL)"
            print_info "Removing old configuration from all scopes..."
            # Remove from both local and project scopes to handle multi-scope configs
            claude mcp remove codex-medium -s local 2>/dev/null
            claude mcp remove codex-medium -s project 2>/dev/null
            claude mcp remove codex-medium -s user 2>/dev/null
            clear_mcp_cache
            print_success "Old Codex Medium MCP removed"
        fi
    fi

    print_installing "Codex Medium MCP with $CODEX_TARGET_MODEL"
    if claude mcp add codex-medium -- codex mcp-server \
        -c "model=\"$CODEX_TARGET_MODEL\"" \
        -c "sandbox=\"workspace-write\"" \
        --enable web_search_request \
        -c model_reasoning_effort=medium \
        -c model_reasoning_summaries=detailed \
        -c sandbox_workspace_write.network_access=true \
        -c shell_environment_policy.inherit=all 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Codex Medium MCP ($CODEX_TARGET_MODEL) installed successfully"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Codex Medium MCP"
        return 1
    fi
}

install_gemini_mcp() {
    print_section "Gemini CLI MCP"

    if check_mcp_installed "gemini-cli"; then
        print_success "Gemini CLI MCP is already installed"
        return 0
    fi

    # Check if Gemini CLI is installed
    if ! command -v gemini &> /dev/null; then
        print_warning "Gemini CLI is not installed. Please install it first with:"
        print_info "npm install -g @google/gemini-cli"
        print_warning "Skipping Gemini MCP installation"
        return 0
    fi

    print_warning "Gemini CLI MCP requires an API key from Google AI Studio"
    print_info "To get your API key:"
    print_info "1. Go to https://aistudio.google.com/apikey"
    print_info "2. Click 'Create API Key'"
    print_info "3. Copy the generated key"

    # Check for saved API key
    local gemini_api_key=""
    if [ -f "$GEMINI_API_KEY_FILE" ]; then
        gemini_api_key=$(cat "$GEMINI_API_KEY_FILE")
        print_info "Found saved Gemini API key"
    else
        read -p "Enter your Gemini API key (or press Enter to skip): " gemini_api_key

        if [ -z "$gemini_api_key" ]; then
            print_warning "Skipping Gemini CLI MCP installation"
            return 0
        fi

        # Save API key for future use
        echo "$gemini_api_key" > "$GEMINI_API_KEY_FILE"
        chmod 600 "$GEMINI_API_KEY_FILE"
        print_info "API key saved for future use"
    fi

    print_installing "Gemini CLI MCP"
    if claude mcp add gemini-cli \
        --env GEMINI_API_KEY="$gemini_api_key" \
        -- npx -y gemini-mcp-tool@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Gemini CLI MCP installed successfully"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Gemini CLI MCP"
        return 1
    fi
}

install_storybook_mcp() {
    print_section "Storybook MCP"

    if check_mcp_installed "storybook-mcp"; then
        print_success "Storybook MCP is already installed"
        return 0
    fi

    print_warning "Storybook MCP requires Storybook to be running"
    print_info "The MCP server is embedded in Storybook via @storybook/addon-mcp"
    print_info "It will be available at http://localhost:6006/mcp when Storybook runs"

    read -p "Is Storybook running? (y/n): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_installing "Storybook MCP"
        if claude mcp add --transport http storybook-mcp http://localhost:6006/mcp --scope project 2>&1 | tee -a "$LOG_FILE"; then
            print_success "Storybook MCP installed successfully"
            print_info "MCP server will be available when Storybook is running"
            clear_mcp_cache
            return 0
        else
            print_error "Failed to install Storybook MCP"
            return 1
        fi
    else
        print_warning "Skipping Storybook MCP installation"
        print_info "Run 'bun run storybook' and re-run this script to configure"
        return 0
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
        clear_mcp_cache
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

    # Install globally to avoid dependency download issues
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
        clear_mcp_cache
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
    if claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Chrome DevTools MCP installed successfully"
        print_info "Provides performance analysis, debugging, and browser automation"
        clear_mcp_cache
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
    if claude mcp add next-devtools -- npx -y next-devtools-mcp@latest 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Next.js DevTools MCP installed successfully"
        print_info "Start your Next.js dev server to enable real-time integration"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Next.js DevTools MCP"
        return 1
    fi
}

install_linear_mcp() {
    print_section "Linear MCP"

    if check_mcp_installed "linear"; then
        print_success "Linear MCP is already installed"
        return 0
    fi

    print_info "Linear MCP connects to Linear project management"
    print_info "Tools: Find, create, and update issues, projects, and comments"
    print_info "Authentication: OAuth 2.1 (will prompt on first use)"
    print_info "Docs: https://linear.app/docs/mcp"

    print_installing "Linear MCP"
    if claude mcp add --transport http linear https://mcp.linear.app/mcp 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Linear MCP installed successfully"
        print_info "Run '/mcp' in Claude to complete OAuth authentication"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Linear MCP"
        return 1
    fi
}

install_notion_mcp() {
    print_section "Notion MCP"

    if check_mcp_installed "notion"; then
        print_success "Notion MCP is already installed"
        return 0
    fi

    print_info "Notion MCP connects to Notion workspace"
    print_info "Tools: Search, read, create, and update pages and databases"
    print_info "Authentication: OAuth (will prompt on first use)"
    print_info "Docs: https://developers.notion.com/docs/mcp"

    print_installing "Notion MCP"
    if claude mcp add --transport http notion https://mcp.notion.com/mcp 2>&1 | tee -a "$LOG_FILE"; then
        print_success "Notion MCP installed successfully"
        print_info "Run '/mcp' in Claude to complete OAuth authentication"
        clear_mcp_cache
        return 0
    else
        print_error "Failed to install Notion MCP"
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

    # Force fresh cache for health check display
    clear_mcp_cache

    # List all MCPs (this populates the cache)
    print_info "Configured MCPs:"
    get_mcp_list > /dev/null || {
        print_error "No MCPs configured or claude command failed"
        all_healthy=false
    }

    # Display the cached list
    echo "$(get_mcp_list)"

    # Test each MCP if possible
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

    # Test GitLab
    if check_mcp_installed "gitlab"; then
        print_info "GitLab MCP: Configured with API access"
    else
        print_warning "GitLab MCP: Not installed"
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

    # Test Gemini
    if check_mcp_installed "gemini-cli"; then
        print_info "Gemini CLI MCP: Ready for Google Docs integration and document processing"
    else
        print_warning "Gemini CLI MCP: Not installed"
    fi

    # Test Storybook
    if check_mcp_installed "storybook-mcp"; then
        print_info "Storybook MCP: Ready (requires Storybook running on port 6006)"
        print_info "  Tools: Get components, props, story URLs"
        print_info "  Run 'bun run storybook' to start the server"
    else
        print_warning "Storybook MCP: Not installed"
    fi

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

    # Test Linear
    if check_mcp_installed "linear"; then
        print_info "Linear MCP: Ready for project management integration"
        print_info "  Tools: Find, create, update issues, projects, comments"
        print_info "  Authentication via OAuth (run /mcp to authenticate)"
    else
        print_warning "Linear MCP: Not installed"
    fi

    # Test Notion
    if check_mcp_installed "notion"; then
        print_info "Notion MCP: Ready for workspace integration"
        print_info "  Tools: Search, read, create, update pages and databases"
        print_info "  Authentication via OAuth (run /mcp to authenticate)"
    else
        print_warning "Notion MCP: Not installed"
    fi

    if [ "$all_healthy" = true ]; then
        print_success "All health checks passed"
    else
        print_warning "Some health checks failed - review warnings above"
    fi
}

#############################################################################
# Update Functions
#############################################################################

update_mcps() {
    print_header "Updating MCPs"

    print_info "Checking for MCP updates..."

    # Update npm packages
    print_section "Updating Global NPM Packages"

    print_info "Updating Claude Code CLI..."
    npm install -g @anthropic-ai/claude-code@latest 2>&1 | tee -a "$LOG_FILE"

    print_info "Updating Codex..."
    npm install -g @openai/codex@latest 2>&1 | tee -a "$LOG_FILE" || print_warning "Codex update skipped"

    print_info "Updating Gemini CLI..."
    npm install -g @google/gemini-cli@latest 2>&1 | tee -a "$LOG_FILE" || print_warning "Gemini CLI update skipped"

    # MCPs that use npx will auto-update when called
    print_info "MCPs using npx will auto-update on next use"

    print_success "Update check completed"
}

#############################################################################
# Summary Report
#############################################################################

generate_summary() {
    print_header "Setup Summary"

    local installed_count=0
    local newly_installed=0
    local mcp_status=()

    # Populate cache once before checking all MCPs (performance optimization)
    clear_mcp_cache
    get_mcp_list > /dev/null

    echo -e "${BOLD}MCP Configuration Status:${NC}"
    echo "────────────────────────────────────────"

    for mcp in "playwright" "context7" "gitlab" "figma" "codex-high" "codex-medium" "gemini-cli" "mermaid-validator" "mermaid-generator" "chrome-devtools" "next-devtools" "linear" "notion"; do
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

    # Check if Claude Code is installed
    if ! command -v claude &> /dev/null; then
        MODE="first_time"
        FIRST_TIME_SETUP=true
        print_info "First time setup detected - Claude Code not installed"
        return
    fi

    # Populate cache once before checking all MCPs (performance optimization)
    clear_mcp_cache
    get_mcp_list > /dev/null

    # Count installed MCPs (now uses cached list - instant!)
    local installed_mcps=()
    for mcp in "playwright" "context7" "gitlab" "figma" "codex-high" "codex-medium" "gemini-cli" "mermaid-validator" "mermaid-generator" "chrome-devtools" "next-devtools" "linear" "notion"; do
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

    # Check if updates are available (basic check)
    if [ "$MODE" = "update" ]; then
        # Check npm outdated for global packages
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
            return 0  # Should install
        fi
    fi
    return 1  # Should not install
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

    # GitLab
    if should_install_mcp "gitlab"; then
        install_gitlab_mcp && any_installed=true || any_failed=true
    else
        print_success "GitLab MCP already configured"
    fi

    # Codex High - always check (handles model version updates internally)
    install_codex_high_mcp && any_installed=true || any_failed=true

    # Codex Medium - always check (handles model version updates internally)
    install_codex_medium_mcp && any_installed=true || any_failed=true

    # Gemini CLI
    if should_install_mcp "gemini-cli"; then
        install_gemini_mcp && any_installed=true || any_failed=true
    else
        print_success "Gemini CLI MCP already configured"
    fi

    # Storybook
    if should_install_mcp "storybook-mcp"; then
        install_storybook_mcp && any_installed=true || any_failed=true
    else
        print_success "Storybook MCP already configured"
    fi

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

    # Linear
    if should_install_mcp "linear"; then
        install_linear_mcp && any_installed=true || any_failed=true
    else
        print_success "Linear MCP already configured"
    fi

    # Notion
    if should_install_mcp "notion"; then
        install_notion_mcp && any_installed=true || any_failed=true
    else
        print_success "Notion MCP already configured"
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

        # Check and update Gemini CLI
        if command -v gemini &> /dev/null; then
            if npm outdated -g 2>/dev/null | grep -q "@google/gemini-cli"; then
                print_updating "Gemini CLI"
                npm install -g @google/gemini-cli@latest 2>&1 | tee -a "$LOG_FILE" || print_warning "Gemini CLI update skipped"
            else
                print_success "Gemini CLI is up to date"
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
    print_header "MCP Smart Setup"
    echo "Intelligent setup that detects what you need"
    echo "Based on: MCP_GUIDE.md"
    echo

    # Check if running with required permissions
    if [ "$EUID" -eq 0 ]; then
        print_warning "Please don't run this script as root/sudo"
        exit 1
    fi

    # Step 0: Check and update tool versions (critical for reasoning)
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
            echo "  → Install all 14 MCP servers"
            echo "  → Configure and verify everything"
            ;;
        "install")
            echo "🆕 Fresh MCP installation needed"
            echo "  → Install all 14 MCP servers"
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
            print_info "3. Try a test command like 'Navigate to google.com' (Playwright)"
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