#!/usr/bin/env bash

# Note: this assume all changes have been staged and committed before running

echo "Cleaning dist..."
npm run clean

echo "Building production app bundle..."
npm run app:build-prod

echo "Pushing to main..."
git push origin main
