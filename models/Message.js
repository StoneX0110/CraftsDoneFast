const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: Date,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chat'},
});

module.exports = Chat = mongoose.model('message', MessageSchema);