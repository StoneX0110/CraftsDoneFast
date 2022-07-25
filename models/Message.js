const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    },
    type: {
        type: String,
        required: true
    },
    createdAt: Date,
});

module.exports = Message = mongoose.model('message', MessageSchema);