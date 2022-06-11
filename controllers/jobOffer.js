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


exports.insertJobOffer = ((req, res) => {
    const receivedJob = req.body;
    const jobOffer = req.body;
    jobOffer.author = req.userId;
    const transformedImage = [];
    jobOffer.images.forEach(element => {
        transformedImage.push({data: new Buffer.from(element, 'base64'), contentType: "image/jpeg"});
      });
    jobOffer.images = transformedImage;
    console.log(jobOffer);   
    jobOfferModel(jobOffer).save((error, job) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            res.send(job.id);
        }
    })
});