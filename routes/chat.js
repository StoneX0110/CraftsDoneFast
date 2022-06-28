const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {createChat, getMyChats} = require("../controllers/chat");
const verifyToken = authJwt.verifyToken;

router.route('/create').post([verifyToken], createChat);

router.route('/getMyChats').get([verifyToken], getMyChats);

module.exports = router;