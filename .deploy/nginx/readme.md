## Quick notes regarding setup of NGINX

- NGINX is serving a public facing website created using ASTRO.BUILD
- There is a backend server which also created with Astro and run as standaolne NodeJS application managed by PM2
- Lets encrypt SSL certificate is added using Certbot (with auto renew cron job), see more details here
  https://certbot.eff.org/instructions?ws=nginx&os=snap&tab=standard

# Reverse-proxy settings

In order to make a smooth integration of frontend and backend following reverse proxy setting added to NGINX config file (default.conf)

1. Server islands path

```
location /_server-islands/ {
  proxy_pass http://127.0.0.1:4321;
  include /etc/nginx/proxy_params;
}
```

2. Image processing path

```
location /_image {
  proxy_pass http://127.0.0.1:4321;
  include /etc/nginx/proxy_params;
}
```

3. On-demand rendering custom paths & Web API

```
location /catalog {
  proxy_pass http://127.0.0.1:4321;
  include /etc/nginx/proxy_params;
}

location /api {
  proxy_pass http://127.0.0.1:4321;
  include /etc/nginx/proxy_params;
}
```
