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
      },
    },
  ],
};
