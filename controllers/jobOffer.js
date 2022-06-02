const jobOfferModel = require('../models/JobOffer');

exports.getJobOffers = ((req, res) => {
    jobOfferModel.find({}).then(function (jobs) {
        res.send(jobs);
    })
});

exports.getJobOffer = ((req, res) => {
    jobOfferModel.find({_id: req.params.id}).then(function (job) {
        res.send(job[0]);
    })
});


exports.insertJobOffer = ((req, res) => {
    const jobOffer = req.body;
    jobOfferModel(jobOffer).save((error, job) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            console.log(job.id)
            res.send(job.id);
        }
    })
});