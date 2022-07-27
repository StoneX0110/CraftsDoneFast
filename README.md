# Installing

Repository will be used for our backend.

## Guarantee that MongoDB Community Server, Node.js and npm is installed

## Setup MongoDB

```
mongo
```

Initially create once the database for CraftsDoneFast cdf
```
use cdf;
```

## Fetch Backend Git Repository

```
git clone https://gitlab.lrz.de/seba-master-2022/team-45/backend.git
```

## Install all specified dependencies via npm
```
npm install //--force could be required, if a package is outdated
```

# Starting

Start MongoDB, if not yet started.

Depending on your installation, you can start the database with e.g.
```
mongo
```

Within the backend parent folder start the server by

```
nodemon server
```

# Installation on Windows

## Install prerequisites
Make sure that NodeJS (and npm) are installed.

## Install MongoDB
Download and install MongoDB Community Server 6.0.0 from https://www.mongodb.com/try/download/community. <br/>
Agree to all default settings, including the installation of the MongoDB Compass tool which is useful for checking the database on-the-fly.
The MongoDB should automatically start running and also autostart when loading Windows.

## Fetch Backend Git Repository
Get the backend code from Git using any method you are comfortable with or using plain git:
```
git clone https://gitlab.lrz.de/seba-master-2022/team-45/backend.git
```

## Install dependencies
```
npm install //--force could be required, if a package is outdated
```

## Starting the server
Within the backend parent folder start the server with:
```
nodemon server
```
The output should be:
```
Server is running on port: xxxx
Database connected
```

## Troubleshooting
Some issues we encountered and how to fix them:

### nodemon command is not found.
Fix: install nodemon globally using:
```
npm install -g nodemon
```

### Any other command is not found or "running scripts is disabled on this system".
Fix: close all code editors and command windows. Open one cmd instance and execute the following command and confirm with y/j
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Server does not connect to database
("Database connected" is not printed when starting).<br/>
Fix: change the content of database.js to:
```
module.exports = {
    db: 'mongodb://0.0.0.0:27017/cdf'
}
```

### Some modules are not found.
Fix: delete node_modules folder and execute
```
npm install --force
```
