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
   litestream restore -config litestream.yml /Users/iuriig/Sources/altex-astro/db/catalog.db

## Importatnt notes:

- Update path to db file in litestream.yml
- Defined environment variable poinitng to S3 bucket for stroing backup files.
  For ubuntu:
  1. sudo nano /etc/environment

  2. Add values for following variables
     export LITESTREAM_ACCESS_KEY_ID=""
     export LITESTREAM_SECRET_ACCESS_KEY=""
     export LITESTREAM_REPLICA_ENDPOINT=""

  3. Save file and apply variables to current session
     source /etc/environment

  4. Validate
     echo $LITESTREAM_REPLICA_ENDPOINT
