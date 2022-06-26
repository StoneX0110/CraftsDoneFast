const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    jobOffer: {type: mongoose.Schema.Types.ObjectId, ref: 'jobOffer'},
    contract: {type: mongoose.Schema.Types.ObjectId, ref: 'contract'},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'message'}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = Chat = mongoose.model('chat', ChatSchema);