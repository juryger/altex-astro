#! /usr/bin/bash
# dist.zip should be placed at /var/www/altexweb.ru/_updates same as website-deploy.sh

# Clean up local folder
rm -r client
rm -r server
rm -r updates-monitor
rm -r __MACOSX

# Process zip with site files
unzip dist.zip

# Copy client and server to root directory
cp -r client ..
cp -r server ..
cp -r updates-monitor ..

# Clean up local folder
rm -r client
rm -r server
rm -r updates-monitor
rm -r __MACOSX