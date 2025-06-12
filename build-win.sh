#!/bin/bash

# Load .env file
source .env

# Run the builder with GitHub token available
GH_TOKEN=$GH_TOKEN arch -x86_64 npx electron-builder --win --x64 --ia32 --publish always
