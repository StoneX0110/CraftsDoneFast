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
    type: String,
    default: "anonym"
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
  }
});

module.exports = JobOffer = mongoose.model('jobOffer', JobOfferSchema);