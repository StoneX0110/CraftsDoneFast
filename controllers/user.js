const userModel = require('../models/User');

// returns specific user matching a username
exports.getUser = ((req, res) => {
    userModel.find({username: req.params.username}).select(['-password']).then(function (user) {
        res.send(user[0]);
    })
});

//update user
exports.updateUser = ((req, res) => {
    const user = req.body;
    //console.log(user);
    const profilePicture = req.body.profilePicture;
    const transformedProfilePicture = {data: new Buffer.from(profilePicture, 'base64'), contentType: "image/jpeg"};
    console.log(transformedProfilePicture);
    userModel.findByIdAndUpdate(req.userId, {
        $set: {
            "settings": user.state,
            "profilePicture": transformedProfilePicture
        }
    }).then(function (us, err) {
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

/*
Syntax (example):
var body = {
    rating: {
        date: Date.now(),
        stars: 5,
        description: "Test Rating 5"
    },
    id: '62a06b10e879f77b93d63df5',
}
axios.post("api/user/insertCustomerRating", body).then()
 */
exports.insertCustomerRating = ((req, res) => {
    var average;
    userModel.findById(req.body.id).then(async function (us, err) {
        console.log("us:")
        console.log(us)
        var sum = Number(req.body.rating.stars);
        for (let i = 0; i < us.customerRatings.length; i++) {
            sum += Number(us.customerRatings[i].stars);
        }
        average = (sum / (us.customerRatings.length + 1));
        await userModel.findByIdAndUpdate(req.body.id, {
            $set: {
                averageCustomerRating: average
            },
            $push: {
                customerRatings: req.body.rating
            }
        }).then(function (us, err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(us);
            }
        });
    })
});
exports.insertCraftsmanRating = ((req, res) => {
    var average;
    userModel.findById(req.body.id).then(async function (us, err) {
        var sum = Number(req.body.rating.stars);
        for (let i = 0; i < us.craftsmanRatings.length; i++) {
            sum += Number(us.craftsmanRatings[i].stars);
        }
        average = sum / (us.craftsmanRatings.length + 1);

        await userModel.findByIdAndUpdate(req.body.id, {
            $set: {
                averageCraftsmanRating: average
            },
            $push: {
                craftsmanRatings: req.body.rating
            }
        }).then(function (us, err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(us);
            }
        });
    })
});

exports.getAverageCustomerRating = ((req, res) => {
    userModel.findById(req.query.id).select(['averageCustomerRating']).then(function (rating) {
        res.send(rating);
    })
});
exports.getAverageCraftsmanRating = ((req, res) => {
    userModel.findById(req.query.id).select(['averageCraftsmanRating']).then(function (rating) {
        res.send(rating);
    })
});

/*
Syntax (example):
axios.get("api/user/getCustomerRatings", {
    params: {
        id: "62b6fd6da4c0b2901037c34c"
    }
}).then((res) => {
    console.log(res.data.ratings)
})
 */
exports.getCustomerRatings = ((req, res) => {
    userModel.findById(req.query.id).select(['customerRatings']).then(function (ratings) {
        res.send(ratings);
    })
});
exports.getCraftsmanRatings = ((req, res) => {
    userModel.findById(req.query.id).select(['craftsmanRatings']).then(function (ratings) {
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

exports.confirmPayment = ((req, res) => {
    const paymentMethod = req.body;
    //TODO Update
    console.log(paymentMethod);
    res.send(paymentMethod);
});
