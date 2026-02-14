#!/bin/bash

# Script to create GitHub release from CHANGELOG
# Usage: ./scripts/create-release.sh [version]

set -e

# Get version from package.json if not provided
VERSION=${1:-$(node -p "require('./package.json').version")}
TAG="v${VERSION}"

echo "📦 Creating release for version: ${VERSION}"
echo "🏷️  Git tag: ${TAG}"

# Check if tag exists
if ! git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "❌ Error: Git tag $TAG does not exist"
    echo "💡 Run 'bun run version' first to create the version"
    exit 1
fi

# Check if release already exists
if gh release view "$TAG" >/dev/null 2>&1; then
    echo "⚠️  Release $TAG already exists"
    read -p "Do you want to update it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled"
        exit 0
    fi
    UPDATE_FLAG="--edit"
else
    UPDATE_FLAG=""
fi

# Extract release notes from CHANGELOG
echo "📝 Extracting release notes from CHANGELOG.md..."

# Create temporary file for release notes
TEMP_NOTES=$(mktemp)

# Extract content between ## VERSION and next ## or end of file
awk -v version="$VERSION" '
    /^## / {
        if (found) exit;
        if ($2 == version) {
            found = 1;
            next;
        }
    }
    found { print }
' CHANGELOG.md > "$TEMP_NOTES"

# Check if notes were extracted
if [ ! -s "$TEMP_NOTES" ]; then
    echo "❌ Error: Could not find version $VERSION in CHANGELOG.md"
    rm "$TEMP_NOTES"
    exit 1
fi

echo "📤 Creating GitHub release..."

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Create or update release
if [ -n "$UPDATE_FLAG" ]; then
    gh release edit "$TAG" \
        --notes-file "$TEMP_NOTES"
else
    gh release create "$TAG" \
        --title "v${VERSION}" \
        --notes-file "$TEMP_NOTES" \
        --target "$CURRENT_BRANCH"
fi

# Clean up
rm "$TEMP_NOTES"

echo "✅ Release created successfully!"
echo "🔗 https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$TAG"
