#! /usr/bin/bash

# dist.zip should be placed at /var/www/altexweb.ru/_updates same as website-deploy.sh

# Clean up local folder
[ -d "./client" ] && rm -r client
[ -d "./server" ] && rm -r server
[ -d "./updates-monitor" ] && rm -r updates-monitor
[ -d "./__MACOSX" ] && rm -r __MACOSX

# Process zip with site files
unzip dist.zip

# Copy client and server to root directory
[ -d "./client" ] && cp -r client ..
[ -d "./server" ] && cp -r server ..
[ -d "./updates-monitor" ] && cp -r updates-monitor ..

# Clean up local folder
[ -d "./client" ] && rm -r client
[ -d "./server" ] && rm -r server
[ -d "./updates-monitor" ] && rm -r updates-monitor
[ -d "./__MACOSX" ] && rm -r __MACOSX