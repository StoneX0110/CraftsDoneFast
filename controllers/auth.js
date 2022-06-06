/*
used from Daniel Testor bachelor thesis and adapted from the following initially:
Used from tutorial, accessed 06.05.2021
https://dev.to/kevin_odongo35/jwt-authorization-and-authentication-node-express-and-vue-2p8c
*/

const crypto = require('crypto');
const userModel = require('../models/User');



var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // res.send({success: "ok"});
    const user = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    };
    userModel.create(user, err => {
      if (err) {
        res.status(500).send({ message: "User could not be created: " + err });
        return;
      }
      res.send({ message: "User was registered successfully!" });
    });



  /*
  User.create((err, user) => {
    if (err) {
      console.log("user creation");
      res.status(500).send({ message: "User was not found: " + err });
      return;
    }

    // if (req.body.roles) {
    //   Role.find(
    //     {
    //       name: { $in: req.body.roles }
    //     },
    //     (err, roles) => {
    //       if (err) {
    //         res.status(500).send({ message: "Role was not found: " + err });
    //         return;
    //       }

    //       user.roles = roles.map(role => role._id);
    //       user.settings = {
    //         university: "",
    //       };

    //       User.create(err => {
    //         if (err) {
    //           res.status(500).send({ message: err });
    //           return;
    //         }

    //         res.send({ message: "User was registered successfully!" });
    //       });
    //     }
    //   );
    // } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          console.log("Role not found");
          res.status(500).send({ message: "Role was not found: " + err });
          return;
        }
        user.roles = [role._id];
        console.log(role._id);

        User.create(err => {
          if (err) {
            res.status(500).send({ message: "User was not found: " + err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    // }
  });
  */
};

exports.signin = (req, res) => {
  userModel.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'sect239k1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });



      // generate a signature of the payload
      const sign = crypto.createSign('SHA256');
      sign.write(`${user}`);
      sign.end();
      var signature = sign.sign(privateKey, 'hex');

      // sign username
      var token = jwt.sign({ id: user.id }, signature, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        accessToken: token, // access token
        signature: signature, // signature
        settings: user.settings,
      });
    });
};
