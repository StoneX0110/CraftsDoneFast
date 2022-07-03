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
axios.post("api/user/insertRating", body).then()
 */
exports.insertRating = ((req, res) => {
    var average;
    userModel.findById(req.body.id).then(async function (us, err) {
        var sum = req.body.rating.stars;
        for (let i = 0; i < us.ratings.length; i++) {
            sum += us.ratings[i].stars;
        }
        average = sum / (us.ratings.length + 1);

        await userModel.findByIdAndUpdate(req.body.id, {
            $set: {
                averageRating: average
            },
            $push: {
                ratings: req.body.rating
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

exports.getAverageRating = ((req, res) => {
    userModel.findById(req.query.id).select(['averageRating']).then(function (rating) {
        res.send(rating);
    })
});

/*
Syntax (example):
axios.get("api/user/getRatings", {
    params: {
        id: "62b6fd6da4c0b2901037c34c"
    }
}).then((res) => {
    console.log(res.data.ratings)
})
 */
exports.getRatings = ((req, res) => {
    userModel.findById(req.query.id).select(['ratings']).then(function (ratings) {
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
