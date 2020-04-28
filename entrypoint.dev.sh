#!/bin/bash

npm run migrate:latest
env SKIP_IF_ALREADY_RUN=true npm run seed 
npm run dev