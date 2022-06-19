const userModel = require('../models/User');
const jobOfferModel = require("../models/JobOffer");

// returns specific user matching an username
exports.getUser = ((req, res) => {
    userModel.find({username: req.params.username}).select(['-password']).then(function (user) {
        res.send(user[0]);
    })
});

//update user
exports.updateUser = ((req, res) => {
    const user = req.body;
    //console.log(user);
    userModel.findByIdAndUpdate(user.id, {$set: {"settings": user.state}}).then(function(us, err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(us);
        }
    })
});