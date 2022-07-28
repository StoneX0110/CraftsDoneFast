const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {createPaymentIntent} = require("../controllers/payment");
const verifyToken = authJwt.verifyToken;

router.route('/createPaymentIntent').post([verifyToken], createPaymentIntent);

module.exports = router
