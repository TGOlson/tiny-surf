#!/usr/bin/env bash

# Note: this assume all changes have been staged and committed before running

echo "Cleaning dist & assets..."
npm run clean
rm -rf assets/

echo "Building production app bundle..."
npm run app:build-prod

mkdir assets/
cp dist/app.* assets/

# echo "Pushing to main..."
# git push origin main
