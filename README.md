# nodejs-mongodb-auth

---

A Node.js app for basic authentication using MongoDB.

## Running Locally

Prerequisites: [Node.js](http://nodejs.org/). [MongoDB](https://www.mongodb.com/download-center/community).

```sh
git clone https://github.com/nickpersad/nodejs-mongodb-auth.git
cd nodejs-mongodb-auth
npm install
#Copy default environment file and add your config variables
cp .env.default .env
#Run in dev environment with hot reload or run with built app
npm run start:dev
```

Your app should now be running on [localhost:8080](http://localhost:8080/).

## Environment file (.env)

```sh
########################################################################
##   Environment variables used for Node App
##
##   DEBUG - 1 is ON: errors/info will be shown in console. 0 is OFF: errors/info will be shown in GrayLog.
##   PORT - Port to set Node to listen on.
##   APPLICATION_NAME - Name of application.
##   MONGODB_CONNECTION - Connection to MongoDB.
##
########################################################################
```
