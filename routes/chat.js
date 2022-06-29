const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {createChat, getMyChats, postMessageToChat} = require("../controllers/chat");
const verifyToken = authJwt.verifyToken;

router.route('/create').post([verifyToken], createChat);

router.route('/getMyChats').get([verifyToken], getMyChats);

router.route('/postMessageToChat').post([verifyToken], postMessageToChat);

module.exports = router;