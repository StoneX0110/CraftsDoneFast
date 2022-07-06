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
    updateContractDetails,
    updateContractStatus,
    getContractsFromIdArray
} = require("../controllers/chat");
const verifyToken = authJwt.verifyToken;

router.route('/create').post([verifyToken], createChat);

router.route('/getMyChats').get([verifyToken], getMyChats);

router.route('/postMessageToChat').post([verifyToken], postMessageToChat);

router.route('/createContract').post([verifyToken], createContract)

router.route('/getContract').get([verifyToken], getContract)

router.route('/updateContract').post([verifyToken], updateContract)

router.route('/updateContractStatus').post([verifyToken], updateContractStatus)

router.route('/updateContractDetails').post([verifyToken], updateContractDetails)

router.route('/delete/:id').delete([verifyToken], deleteContract)

router.route('/getContractsFromIdArray').get(getContractsFromIdArray)

module.exports = router;