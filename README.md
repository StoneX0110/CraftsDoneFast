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
git clone ....
```

## Install all specified dependencies via npm
```
npm install
```



To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.lrz.de/seba-master-2022/team-45/backend.git
git branch -M main
git push -uf origin main
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



