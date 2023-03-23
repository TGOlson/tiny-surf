#!/usr/bin/env bash

echo "Cleaning dist & assets..."
npm run clean

echo "Building production app bundle..."
npm run app:build-prod

mkdir assets/
cp dist/app.* assets/

echo "Staging changes and pushing to main..."
git add assets/
git commit -m 'Deploy new assets'
git push origin main
