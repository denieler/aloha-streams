apt-get update
apt-get install -y certbot

certbot certonly --webroot --agree-tos --email danielostapenko@gmail.com -w /var/www/letsencrypt -d www.alohastreams.com -d alohastreams.com
