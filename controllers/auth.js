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
        profileBoost: false,
        averageRating: 0,
        settings: {
            name: '',
            address: '',
            birthday: null,
            postalCode: null,
            shortDescription: '',
            description: '',
        },
    };
    if (user.username.includes(" ")) {
        res.status(400).send({ message: "Failed! Spaces in usernames are not allowed!" });
        return;
    }
    userModel.create(user, err => {
        if (err) {
            res.status(500).send({message: "User could not be created: " + err});
            return;
        }
        res.send({message: "User was registered successfully!"});
    });
};

exports.signin = (req, res) => {
    userModel.findOne({
        username: req.body.username
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            if (!user) {
                return res.status(404).send({message: "User not found."});
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

            const {privateKey, publicKey} = crypto.generateKeyPairSync('ec', {
                namedCurve: 'sect239k1',
                publicKeyEncoding: {type: 'spki', format: 'pem'},
                privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
            });


            // generate a signature of the payload
            const sign = crypto.createSign('SHA256');
            sign.write(`${user}`);
            sign.end();
            var signature = sign.sign(privateKey, 'hex');

            // sign username
            var token = jwt.sign({id: user.id}, signature, {
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
