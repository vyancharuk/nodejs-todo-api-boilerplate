#!/bin/bash

# --------------------------------------------------
#   1) Runs migrations
#   2) Seeds the database
#   3) Runs tests with a custom heap memory limit
# --------------------------------------------------

echo "==> Running DB migrations..."
npm run migrate:latest

echo "==> Seeding the DB..."
env npm run seed 

echo "==> Running tests with increased heap size..."
npm run test -- --max-old-space-size=1536