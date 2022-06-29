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

exports.insertRating = ((req, res) => {
    const user = req.body; // TODO use correct req-attributes to get user (req.query.x?)
    userModel.findByIdAndUpdate(user.id, [
        {
            $push: {
                ratings: { // TODO use correct req-attributes to get rating details
                    stars: req.params.stars,
                    description: req.params.description,
                    date: req.params.date,
                }
            }
        }, {
            $set: {
                averageRating: {$avg: "$ratings.stars"}
                // TODO if not working: put arguments in Strings? -> "$avg", etc. OR put set-block in own .find...Update call
            }
        }
    ]).then(function (us, err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(us);
        }
    })
});

exports.getAverageRating = ((req, res) => {
    userModel.findById(req.query.author).select(['averageRating']).then(function (rating) {
        res.send(rating);
    })
});

exports.getRatings = ((req, res) => {
    const user = req.body; // TODO call correct attributes (req.query.x?)
    userModel.findById(user.id).select(['ratings']).then(function (ratings) {
        res.send(ratings);
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
