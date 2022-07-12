# Installing

Repository will be used for our backend.

## Guarantee that MongoDB Community Server, Node.js and npm is installed

## Start MongoDB

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

Start MongoDB
```
mongo
```

Within the backend parent folder start the server by

```
nodemon server
```



