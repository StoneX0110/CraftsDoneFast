const mongoose = require('mongoose');

const JobOfferSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    priceExpectation: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    insertionDate: {
        type: Date,
        default: Date.now
    },
    postalCode: {
        type: Number
    },
    updated_date: {
        type: Date,
        default: Date.now
    },
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ],
});

module.exports = JobOffer = mongoose.model('jobOffer', JobOfferSchema);