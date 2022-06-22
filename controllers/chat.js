const chatModel = require('../models/Chat');

exports.createChat = ((req, res) => {
    const chat = req.body;
    chatModel(chat).save((error, createdChat) => {
        if (error) {
            console.log(error)
            res.send(error)
        } else {
            res.send(createdChat.id);
        }
    })
});