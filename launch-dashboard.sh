#!/bin/bash

# Meraki Media — Mission Control Auto-Launch
# This script ensures the dashboard is running locally.

echo "🚀 Launching Mission Control..."

cd "$(dirname "$0")/mission-control"

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dashboard dependencies..."
  npm install
fi

# Start the dev server in the background if not already running
if ! lsof -i:3000 > /dev/null; then
  echo "🛰️ Starting Next.js Dev Server..."
  npm run dev &
  sleep 5
else
  echo "✅ Dashboard already pulse detected on port 3000."
fi

# Open in browser
echo "🎨 Opening Mission Control..."
open "http://localhost:3000"

echo "✨ System online."
