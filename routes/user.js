const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {getUser, updateUser, updateUserChats, getMatchingProfiles,getMatchingProfilesInRange, confirmPayment, insertRating, getAverageRating, getRatings} = require("../controllers/user.js");
const verifyToken = authJwt.verifyToken;

router.get('/profile/:username', getUser);

router.route('/matchingProfilesInRange').get(getMatchingProfilesInRange);

router.route('/matchingProfiles').get(getMatchingProfiles);

router.route('/getAverageRating').get(getAverageRating);

router.route('/getRatings').get(getRatings);

router.route('/insertRating').post(insertRating);

router.route('/update').post([verifyToken], updateUser);

router.route('/updateUserChats').post(updateUserChats);

router.route('/confirmPayment').post([verifyToken], confirmPayment);


module.exports = router;
