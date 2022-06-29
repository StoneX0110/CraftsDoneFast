const userModel = require('../models/User');

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
    userModel.findByIdAndUpdate(req.userId, {$set: {"settings": user.state}}).then(function (us, err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(us);
        }
    })
});

//update user chats (separate function without verifying)
exports.updateUserChats = ((req, res) => {
    const user = req.body;
    //console.log(user);
    userModel.findByIdAndUpdate(user.id, {$set: {"chats": user.chats}}).then(function (us, err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(us);
        }
    })
});

// returns profiles matching attributes
exports.getMatchingProfiles = ((req, res) => {
    if (req.query.category === "Any") {
        userModel.find().select(['-password']).then(function (jobs) {
            res.send(jobs);
        })
    } else {
        userModel.find({
            "settings.skills.value": req.query.category,
        }).select(['-password']).then(function (jobs) {
            res.send(jobs);
        })
    }
});

exports.getMatchingProfilesInRange = ((req, res) => {
    if (req.query.category === "Any") {
        userModel.find({
            "settings.postalCode": {$in: req.query.zips}
        }).select(['-password']).then(function (jobs) {
            res.send(jobs);
        })
    } else {
        userModel.find({
            "settings.skills.value": req.query.category,
            "settings.postalCode": {$in: req.query.zips}
        }).select(['-password']).then(function (jobs) {
            res.send(jobs);
        })
    }
});

exports.confirmPayment = ((req, res) => {
    const paymentMethod = req.body;
    //TODO Update
    console.log(paymentMethod);
    res.send(paymentMethod);
});
