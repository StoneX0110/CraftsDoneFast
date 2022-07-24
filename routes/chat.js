const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {
    createChat,
    getMyChats,
    postMessageToChat,
    createContract,
    getContract,
    deleteContract,
    updateContract,
    getContractsFromIdArray,
    deleteChat
} = require("../controllers/chat");
const verifyToken = authJwt.verifyToken;

router.route('/create').post([verifyToken], createChat);

router.route('/getMyChats').get([verifyToken], getMyChats);

router.route('/delete/:id').delete([verifyToken], deleteChat)

router.route('/postMessageToChat').post([verifyToken], postMessageToChat);

router.route('/createContract').post([verifyToken], createContract)

router.route('/getContract').get([verifyToken], getContract)

router.route('/updateContract').post([verifyToken], updateContract)

router.route('/delete/:id').delete([verifyToken], deleteContract)

router.route('/getContractsFromIdArray').get(getContractsFromIdArray)

module.exports = router;