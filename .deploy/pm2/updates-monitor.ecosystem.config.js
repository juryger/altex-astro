module.exports = {
  apps: [
    {
      name: "altex-updates-nodejs",
      script: "../updates-monitor/index.js",
      instances: 1,
      cron_restart: "0 * * * *",
      env: {
        NODE_ENV: "production",
        // Add another environment variables below
        ENABLE_TRACING: "false",
        UPDATES_MONITORING_PATH: "/home/altex-uploader/sync",
        POISONED_DIRECOTRY_NAME: "poisoned",
        THUMBNAILS_DIRECOTRY_NAME: "thumbnails",
        DB_GENERAL_PATH: "/var/www/altexweb.ru/db/general.db",
        DB_OPERATIONS_PATH: "/var/www/altexweb.ru/db/operations.db",
        DB_CATALOG_PATH: "/var/www/altexweb.ru/db/catalog.db",
        DB_READ_REPLICAS_PATH: "/var/www/altexweb.ru/db/replicas",
        EMAIL_TEMPLATES_PATH: "/var/www/altexweb.ru/emails",
        EMAIL_REDIRECT_URI: "https://developers.google.com/oauthplayground",
        EMAIL_CLIENT_ID:
          "429861037116-4m3uc9q20kiocmtjubii8pl3tgo3rfoh.apps.googleusercontent.com",
        EMAIL_CLIENT_SECRET: "",
        EMAIL_REFRESH_TOKEN: "",
        S3_ENDPOINT_URL: "https://s3.regru.cloud",
        S3_BUCKET_IMAGES: "altexweb-images",
        S3_BUCKET_THUMBNAILS: "altexweb-thumbnails",
        S3_ACCESS_KEY_ID: "",
        S3_SECRETE_ACCESS_KEY: "",
      },
    },
  ],
};
