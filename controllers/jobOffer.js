const jobOfferModel = require('../models/JobOffer');
const chatModel = require('../models/Chat');
const userModel = require('../models/User');


// returns all job offers of a specific user
exports.getMyJobOffers = ((req, res) => {
    jobOfferModel.find({ author: req.userId }).then(function (jobs) {
        res.send(jobs);
    })
});

// returns all job offers from chats of user where they are the craftsman
exports.getMyJobOfferRequests = ((req, res) => {
    chatModel.find({"users.craftsman": req.userId, "jobOffer": {$exists: true}}).select('jobOffer').then(function (jobOfferIdObjs, err) {
        //returns e.g., [{_id: new ObjectId("i87gio45go8t"), jobOffer: new ObjectId("i37h4zs555dgf3rtw")}]
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            //get job offers for each gathered id
            let jobOffersTemp = [];
            let offerCount = 0;
            jobOfferIdObjs.forEach(jobOfferIdObj => {
                jobOfferModel.findById(jobOfferIdObj['jobOffer']).then(function (offer) {
                    jobOffersTemp.push(offer);
                    offerCount++;
                    if (offerCount === jobOfferIdObjs.length) res.send(jobOffersTemp);
                })
            })
        }
    })
})

// returns 10 most recent job offers
exports.getRecentJobOffers = ((req, res) => {
    jobOfferModel.find().sort({ 'insertionDate': -1 }).populate('author', 'profileBoost').limit(10).then(function (jobs) {
        let result = prioritizeJobOffers(jobs);
        res.send(result);
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
        jobOfferModel.find().sort({ 'insertionDate': -1 }).populate('author', 'profileBoost').then(function (jobs) {
            let result = prioritizeJobOffers(jobs);
            res.send(result);
        })
    } else {
        jobOfferModel.find({
            category: req.query.category,
        }).sort({ 'insertionDate': -1 }).populate('author', 'profileBoost').then(function (jobs) {
            let result = prioritizeJobOffers(jobs);
            res.send(result);
        })
    }
});

exports.getMatchingJobOffersInRange = ((req, res) => {
    if (req.query.category === "Any") {
        jobOfferModel.find({
            postalCode: { $in: req.query.zips }
        }).sort({ 'insertionDate': -1 }).populate('author', 'profileBoost').then(function (jobs) {
            let result = prioritizeJobOffers(jobs);
            res.send(result);
        })
    } else {
        jobOfferModel.find({
            category: req.query.category,
            postalCode: { $in: req.query.zips }
        }).sort({ 'insertionDate': -1 }).populate('author', 'profileBoost').then(function (jobs) {
            let result = prioritizeJobOffers(jobs);
            res.send(result);
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

function prioritizeJobOffers(list) {
    let boostedJobOffers = [];
    for (let i = 0; i < list.length; i++) {

        if (list[i].author.profileBoost) {
            let boostedJobOffer = list[i];
            boostedJobOffers.push(boostedJobOffer);

        }        
    }
    let random = getMultipleRandom(boostedJobOffers, 3);
    list.forEach(elem => {
        random.push(elem);
    })
    let transformedArray = [];
    random.forEach(elem => {
        transformedArray.push({
            boost: elem.boost,
            _id: elem._id,
            title: elem.title,
            description: elem.description,
            priceExpectation: elem.priceExpectation,
            category: elem.category,
            author: elem._id,
            postalCode: elem.postalCode,
            images: elem.images,
            insertionDate: elem.insertionDate,
            updated_date: elem.updated_date,
            __v: 0,
        });
    })
    return transformedArray;

};

function getMultipleRandom(arr, num) {
    /*
    inefficient, but need to copy jobOffers instead of referencing it, otherwise the value is changed also in the initial set.
    */
    var newArray = JSON.parse(JSON.stringify(arr)); 
    newArray.forEach(elem => {
        elem.boost = true;
    })
    const shuffled = [...newArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}