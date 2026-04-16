# db backups

Backup service of SQLite databases based on litestream.

## Install

Debian/Ubuntu
`wget https://github.com/benbjohnson/litestream/releases/download/v0.5.8/litestream-0.5.8-linux-x86_64.deb`

Then install using dpkg:
`sudo dpkg -i litestream-0.5.8-linux-x86_64.deb`

Install as a service

```
sudo systemctl enable litestream
sudo systemctl start litestream
```

## Automatic mode

1. Copy content of litestream.yml to /etc/litestream.yml (default location)
2. Restart service
   `sudo systemctl restart litestream`

## Manual mode

1. Replicate db-file
   litestream replicate -config litestream.yml

2. Restore db-file
   litestream restore -config litestream.yml /var/www/altexweb.ru/db/catalog.db

## Importatnt notes

- Update path to db file in litestream.yml
- Defined environment variables to access S3 bucket with backup files.
  For ubuntu:
  1. Open for edit environment varialbes files

     ```
     sudo nano /etc/environment
     ```

  2. Add values for following variables

  ```
  LITESTREAM_ACCESS_KEY_ID=""
  LITESTREAM_SECRET_ACCESS_KEY=""
  ```

  3. Save file and apply variables to current session

  ```
  source /etc/environment
  ```

  4. Validate variable

  ```
  echo $LITESTREAM_S3_ENDPOINT
  ```

  5. Edit systemd service definition file for litestream at `/lib/systemd/system/litestream.service`
     If you are running Litestream as a service, use the EnvironmentFile directive in your service unit to load the file directly:

  ```
  [Unit]
  Description=Litestream

  [Service]
  Restart=always
  EnvironmentFile=/etc/environment
  ExecStart=/usr/bin/litestream replicate

  [Install]
  WantedBy=multi-user.target
  ```

  6. Restart litestrem service

  ```
  systemctl daemon-reload
  sudo systemctl restart litestream
  ```

  7. Check litestream logs

  ```
  sudo journalctl -u litestream -f
  ```

  8. Optionally add firewall output rule

  ```
  sudo ufw allow out 443/tcp
  ```
