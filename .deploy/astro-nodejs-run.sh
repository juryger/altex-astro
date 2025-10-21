#! /usr/bin/bash

# Clean-up previous App installation
pm2 delete altex-nodejs

# Install node packages
corepack enable pnpm
cd ../server
pnpm install

# Create new App using pm2
HOST=127.0.0.1 PORT=4321 pm2 start ./entry.mjs --name altex-nodejs --watch

# Consider to assign Execute permission on script
#chmod u+x server-start.sh