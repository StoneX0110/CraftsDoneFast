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



