const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {getUser, updateUser, updateUserChats, getMatchingProfiles,getMatchingProfilesInRange} = require("../controllers/user.js");
const verifyToken = authJwt.verifyToken;

router.get('/profile/:username', getUser);

router.route('/matchingProfilesInRange').get(getMatchingProfilesInRange);

router.route('/matchingProfiles').get(getMatchingProfiles);

router.route('/update').post([verifyToken], updateUser);

router.route('/updateUserChats').post(updateUserChats);



module.exports = router;
