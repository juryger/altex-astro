module.exports = {
  apps: [
    {
      name: "altex-nodejs",
      script: "../server/entry.mjs",
      watch: true,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 4321,
        // Add another environment variables below
        PUBLIC_ENABLE_TRACING: "false",
        PUBLIC_API_BASE_URL: "http://127.0.0.1:4321/api",
        PUBLIC_BLOB_STORAGE_IMAGES_URL:
          "https://s3.regru.cloud/altexweb-images",
        PUBLIC_BLOB_STORAGE_THUMBNAILS_URL:
          "https://s3.regru.cloud/altexweb-thumbnails",
        ENABLE_TRACING: "flase",
        BREADCRUMB_TITLE_MAX_LENGTH: 20,
        DATA_RECORDS_ON_PAGE: 20,
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
      },
    },
  ],
};
