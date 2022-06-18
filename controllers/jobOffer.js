const jobOfferModel = require('../models/JobOffer');

// returns all job offers of a specific user
exports.getMyJobOffers = ((req, res) => {
    jobOfferModel.find({author: req.userId}).select(['-images']).then(function (jobs) {
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
    jobOfferModel.find({_id: req.params.id}).populate('author', {username: 1}).then(function (job) {
        res.send(job[0]);
    })
});

// returns jobs matching attributes
exports.getMatchingJobOffers = ((req, res) => {
    jobOfferModel.find({category: JSON.parse(req.query.state).category}).sort({ 'insertionDate': -1 }).then(function (jobs) {
        res.send(jobs);
    })
});

exports.insertJobOffer = ((req, res) => {
    const jobOffer = req.body;
    jobOffer.author = req.userId;
    const transformedImage = [];
    jobOffer.images.forEach(element => {
        transformedImage.push({data: new Buffer.from(element, 'base64'), contentType: "image/jpeg"});
      });
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
    jobOfferModel.findByIdAndUpdate(jobOffer._id, {$set: jobOffer}).then(function(job, err) {
        if (err) {
            console.log(error);
            res.send(error);
        } else {
        res.send(job);
        } 
    })
});

exports.deleteJobOffer = ((req, res) => {
    jobOfferModel.findByIdAndRemove(req.params.id).then(function(job, err) {
        if (err) {
            console.log(error);
            res.send(error);
        } else {
            res.send("deleted");
        } 
    })
});