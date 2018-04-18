# How to start dev environment

Go to the root folder `./aloha-streams` where file `docker-compose.yml` is.
Run Mongo DB server by running the command:

```
$ docker-compose up -d db_mongo
```

Go to the folder of the public site `./aloha-streams/src/site`, start dev server:
```
$ yarn start
```

### Configuration

Configuration file with all config variables is `./src/site/env.dev` - for development environment and `./src/site/env.production` - for production environment.
