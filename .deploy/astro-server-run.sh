#! /usr/bin/bash

# Delete App in case it exists
pm2 delete altex-nodejs

# Create new App using pm2
HOST=127.0.0.1 PORT=4321 pm2 start ./server/entry.mjs --name altex-nodejs --watch

# Consider to assign Execute permission on script
#chmod u+x server-start.sh