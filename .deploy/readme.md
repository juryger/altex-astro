## Website and node.js apps deployment to VPS via FTP

1. Prepare build and put them in som folder i.e. dist (client, server, updates-monitor).
2. Compresse the content of dist folder and upload zip file and website-deploy.sh to VPS (i.e. /var/www/altexweb.ru/\_updates)
3. Execute ./website-deploy.sh

By completition of script above, directories client, server and updates_monitor will be unzipped and copied to parent folder (i.e. /var/www/altexweb.ru -> client, server, updates_monitor). To deploy server and updates-monitor folder use ./pm2/server-deploy.sh and ./pm2/updates-monitor-deploy.sh respectively.
