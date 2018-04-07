# How to get SSL certificate

In the infrastructure we have 2 docker containers:
- `node js server`
- `nginx proxy`

The process of getting certificates is happening in `nginx proxy` container.

_Step 1:_

Set `nginx.conf` in `nginx proxy` container with the next content:

```
events {
  worker_connections  4096;  ## Default: 1024
}

http {
  server {
    location ^~ /.well-known/acme-challenge/ {
      default_type "text/plain";
	    root /var/www/letsencrypt;
    }
    
    location / {
      proxy_pass http://public_site:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

_Step 2:_

Deploy everything to AWS with rebuilding containers before and having set up of volumes for `nginx proxy`:

```
volumes:
      - nginx-volume:/etc/letsencrypt
```

_Step 3:_

Using ssh enter AWS instance by doing:

```
ssh -v -F ./.ssh/config -i ./[key-pair name].pem ec2-user@[public IP of instance]
```

Then in the container enter `nginx proxy` container:

```
docker exec -it [nginx container ID] bash
```

_Step 4:_

In the `nginx proxy` container run the script to install certificate (`./.scripts/generate-certificate`):

```
apt-get update
apt-get install -y certbot

certbot certonly --webroot --agree-tos --email [your email] -w /var/www/letsencrypt -d www.alohastreams.com -d alohastreams.com
```

So after that certificates will be generated into the folder `/etc/letsencrypt` in the `nginx proxy` container and because we use volume they will be also stored on AWS instance machine in volume `nginx-volume`, so when you re-deploy docker containers certificates will still be in place.

_Step 5:_

Change original `nginx.conf` to production config:

```
events {
  worker_connections  4096;  ## Default: 1024
}

http {
  ## http://alohastreams.com redirects to https://alohastreams.com
  server {
    listen 80;
    listen [::]:80;
    server_name alohastreams.com;

    location ^~ /.well-known/acme-challenge/ {
      default_type "text/plain";
	    root /var/www/letsencrypt;
    }

    location / {
      return 301 https://alohastreams.com$request_uri;
    }
  }

  ## http://www.alohastreams.com redirects to https://www.alohastreams.com
  server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;
    server_name www.alohastreams.com;

    location ^~ /.well-known/acme-challenge/ {
      default_type "text/plain";
	    root /var/www/letsencrypt;
    }

    location / {
      return 301 https://www.alohastreams.com$request_uri;
    }
  }

  ## https://www.alohastreams.com redirects to https://alohastreams.com
  server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.alohastreams.com;

    ssl_certificate /etc/letsencrypt/live/www.alohastreams.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.alohastreams.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/www.alohastreams.com/fullchain.pem;

    location / {
      return 301 https://alohastreams.com$request_uri;
    }
  }

  ## Serves https://alohastreams.com
  server {
    server_name alohastreams.com;
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server ipv6only=on;

    ssl_certificate /etc/letsencrypt/live/www.alohastreams.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.alohastreams.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/www.alohastreams.com/fullchain.pem;

    location / {
      proxy_pass http://public_site:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

Rebuild containers and deploy to AWS.
