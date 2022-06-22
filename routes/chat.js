const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {createChat} = require("../controllers/chat");
const verifyToken = authJwt.verifyToken;

router.route('/create').post([verifyToken], createChat);

module.exports = router;