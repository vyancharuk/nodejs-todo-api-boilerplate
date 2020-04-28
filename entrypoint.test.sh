#!/bin/bash

npm run migrate:latest
env npm run seed 
npm run test -- --max-old-space-size=1536