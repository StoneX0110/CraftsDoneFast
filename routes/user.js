const express = require('express');
const router = express.Router();
const authJwt = require('../authentication/auth');
const {
    getUser,
    updateUser,
    updateUserChats,
    getMatchingProfiles,
    getMatchingProfilesInRange,
    confirmPayment,
    insertCustomerRating,
    insertCraftsmanRating,
    getAverageCustomerRating,
    getAverageCraftsmanRating,
    getCustomerRatings,
    getCraftsmanRatings,
    payProfile
} = require("../controllers/user.js");
const verifyToken = authJwt.verifyToken;

router.get('/profile/:username', getUser);

router.route('/matchingProfilesInRange').get(getMatchingProfilesInRange);

router.route('/matchingProfiles').get(getMatchingProfiles);

router.route('/getCustomerRatings').get(getCustomerRatings);

router.route('/getCraftsmanRatings').get(getCraftsmanRatings);

router.route('/getAverageCustomerRating').get(getAverageCustomerRating);

router.route('/getAverageCraftsmanRating').get(getAverageCraftsmanRating);

router.route('/insertCustomerRating').post(insertCustomerRating);

router.route('/insertCraftsmanRating').post(insertCraftsmanRating);

router.route('/update').post([verifyToken], updateUser);

router.route('/updateUserChats').post(updateUserChats);

router.route('/confirmPayment').post([verifyToken], confirmPayment);

router.route('/payProfile').post([verifyToken], payProfile);



module.exports = router;
