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
    isSystemMessage: {
        type: Boolean,
        default: false,
    },
    createdAt: Date,
});

module.exports = Chat = mongoose.model('message', MessageSchema);