#!/bin/bash

# --------------------------------------------------
#   1) Runs migrations
#   2) Seeds the database (skipping if already run)
#   3) Starts the development server
# --------------------------------------------------

echo "==> Running DB migrations..."
npm run migrate:latest

echo "==> Seeding the DB (skipping if already run)..."
env SKIP_IF_ALREADY_RUN=true npm run seed 

echo "==> Starting the development server..."
npm run dev