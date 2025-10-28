#! /usr/bin/bash

# Install node packages
corepack enable pnpm
cd ../server
pnpm install
cd ../_updates

# register pm2 as deamon for system integration (autor restart)
pm2 startup

# Clean-up previous App installation
#pm2 delete altex-nodejs
pm2 delete ecosystem.config.js

# Create new App using pm2
#HOST=127.0.0.1 PORT=4321 pm2 start ./entry.mjs --name altex-nodejs --watch
pm2 start ecosystem.config.js

# Freeze a process list for automatic respawn:
pm2 save

# Consider to assign Execute permission on script
#chmod u+x server-start.sh