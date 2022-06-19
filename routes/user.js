const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {getUser, updateUser} = require("../controllers/user");
const verifyToken = authJwt.verifyToken;

router.get('/:username', getUser);

router.route('/update').post([verifyToken], updateUser);

module.exports = router;