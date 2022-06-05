/*
accessed from my (Daniel Testor) bachelor thesis, based on:
Used from tutorial, accessed 06.05.2021
https://dev.to/kevin_odongo35/jwt-authorization-and-authentication-node-express-and-vue-2p8c
*/


const jwt = require("jsonwebtoken");
let User = require('../models/authentication/User');

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  let secret = req.headers["x-access-signature"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Prints: true
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

checkDuplicateUsername = (req, res, next) => {
    // Username
    User.findOne({
      username: req.body.username
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        //console.log("Failed! Username is already in use!");
        return;
      }
      next();
      // Email
      // User.findOne({
      //   email: req.body.email
      // }).exec((err, user) => {
      //   if (err) {
      //     res.status(500).send({ message: err });
      //     return;
      //   }
  
      //   if (user) {
      //     //res.status(400).send({ message: "Failed! Email is already in use!" });
      //     return;
      //   }
  
      //   next();
      // });
    });
  };

const authJwt = {
  verifyToken,
  checkDuplicateUsername,
};
module.exports = authJwt;
