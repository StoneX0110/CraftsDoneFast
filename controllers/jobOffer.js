const jobOfferModel = require('../models/JobOffer');
exports.getMyJobOffers = ((req, res) => {
    console.log(req.userId);
    jobOfferModel.find({author: req.userId}).select(['-images']).then(function (jobs) {
        res.send(jobs);
    })
});

exports.getRecentJobOffers = ((req, res) => {
    jobOfferModel.find().select(['-images']).limit(10).then(function (jobs) {
        res.send(jobs);
    })
});
exports.getJobOffer = ((req, res) => {
    //only populate the username of author. password ofc should not be exposed.
    jobOfferModel.find({_id: req.params.id}).populate('author', {username: 1}).then(function (job) {
        // console.log(__dirname);
        // console.log(job[0]);
        // console.log(job[0].images.toString('base64'));
        // console.log(job[0].images[0].data);
        // const imgBase64 = job[0].images[0].data.toString("base64");
        // console.log(imgBase64);
        // const test = imgBase64;
        // const base64String = btoa(String.fromCharCode(...new Uint8Array(job[0].images[0].data)));
        // // console.log(base64String);
        // job[0].imageurl = base64String;
        // delete job[0].images;
        // const test = "data:image/jpeg;base64," + base64String.substring(20);
        // job[0].images = test;
        // console.log(job[0]);
        // console.log(foo.images[0].data)
        // console.log(foo);
        // console.log(job[0]);
        console.log(job[0]);
        res.send(job[0]);
    })
});


exports.insertJobOffer = ((req, res) => {
    const receivedJob = req.body;
    
    // { data: new Buffer.from(req.file.buffer, 'base64'), contentType: req.file.mimetype }
    const jobOffer = req.body;
    jobOffer.author = req.userId;
    // console.log(jobOffer.images[0]);
    const transformedImage = [];
    jobOffer.images.forEach(element => {
        transformedImage.push({data: new Buffer.from(element, 'base64'), contentType: "image/jpeg"});
      });
    //   console.log(transformedImage);
    jobOffer.images = transformedImage;
    console.log(jobOffer);   
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