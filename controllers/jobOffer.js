const jobOfferModel = require('../models/JobOffer');
const userModel = require('../models/User');


// returns all job offers of a specific user
exports.getMyJobOffers = ((req, res) => {
    jobOfferModel.find({ author: req.userId }).select(['-images']).then(function (jobs) {
        res.send(jobs);
    })
});

// returns 10 most recent job offers
exports.getRecentJobOffers = ((req, res) => {
    jobOfferModel.find().select(['-images']).sort({ 'insertionDate': -1 }).limit(10).then(function (jobs) {
        res.send(jobs);
    })
});

// returns specific job offer matching an ID
exports.getJobOffer = ((req, res) => {
    jobOfferModel.find({ _id: req.params.id }).populate('author', { username: 1 }).then(function (job) {
        res.send(job[0]);
    })
});

// returns jobs matching attributes
exports.getMatchingJobOffers = ((req, res) => {
    if (req.query.category === "Any") {
        jobOfferModel.find().sort({ 'insertionDate': -1 }).then(function (jobs) {
            res.send(jobs);
        })
    } else {
        jobOfferModel.find({
            category: req.query.category,
        }).sort({ 'insertionDate': -1 }).then(function (jobs) {
            res.send(jobs);
        })
    }
});

exports.getMatchingJobOffersInRange = ((req, res) => {
    if (req.query.category === "Any") {
        jobOfferModel.find({
            postalCode: { $in: req.query.zips }
        }).sort({ 'insertionDate': -1 }).then(function (jobs) {
            res.send(jobs);
        })
    } else {
        jobOfferModel.find({
            category: req.query.category,
            postalCode: { $in: req.query.zips }
        }).sort({ 'insertionDate': -1 }).then(function (jobs) {
            res.send(jobs);
        })
    }
});

exports.insertJobOffer = ((req, res) => {
    const jobOffer = req.body;
    jobOffer.author = req.userId;
    const transformedImage = [];
    //images sent from the client has to be converted again from the buffer data to an image before persisting them
    jobOffer.images.forEach(element => {
        transformedImage.push({ data: new Buffer.from(element, 'base64'), contentType: "image/jpeg" });
    });
    //set those images to the jobOffer before persisting
    jobOffer.images = transformedImage;
    jobOfferModel(jobOffer).save((error, job) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            res.send(job.id);
        }
    })
});

exports.updateJobOffer = ((req, res) => {
    const jobOffer = req.body;
    delete jobOffer.popup;
    //the respective jobOffer is found by the id, which was sent and the current persisted object is afterwards replaced with the received one
    jobOfferModel.findById({
        _id: jobOffer._id
    }).then((offer, errJob) => {
        if (errJob) {
            res.send(errJob);
        }
        //compare that the initial author and sent author is the same (author can not be changed)
        //compare that the author of the jobOffer equals the authentication token of the user, who sent the request
        if (req.userId !== jobOffer.author._id.toString() || req.userId !== offer.author._id.toString()) {
            res.status(401).send({ message: "Unauthorized!" });
            return;
        }
        jobOfferModel.findByIdAndUpdate(jobOffer._id, { $set: jobOffer }).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send(job);
            }
        })
    })
});

exports.deleteJobOffer = ((req, res) => {
    jobOfferModel.findById({
        _id: req.params.id
    }).then((offer, errJob) => {
        if (errJob) {
            res.send(errJob);
        }
        //validate that the user who sent the request equals the author of the jobOffer, which should be deleted
        if (req.userId !== offer.author._id.toString()) {
            res.status(401).send({ message: "Unauthorized!" });
            return;
        }
        jobOfferModel.findByIdAndRemove(req.params.id).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send("deleted");
            }
        })
    });
});