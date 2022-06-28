const chatModel = require('../models/Chat');
const userModel = require("../models/User");

exports.createChat = ((req, res) => {
        const chat = req.body;
        userModel.find({username: chat.users.craftsman}).select(['_id']).then(function (usId, err) {
                let newCraftsman = usId[0]._id.valueOf();

                userModel.find({username: chat.users.client}).select(['_id']).then(function (usId2, err) {
                    chat.users = {craftsman: newCraftsman, client: usId2[0]._id.valueOf()};

                    chatModel(chat).save((error, createdChat) => {
                        if (error) {
                            console.log(error)
                            res.send(error)
                        } else {
                            Object.keys(chat.users).forEach(key => {
                                userModel.findByIdAndUpdate(chat.users[key], {$push: {"chats": createdChat.id}}).then(function (us, err) {
                                    if (err) {
                                        console.log(err);
                                        res.send(err);
                                    }
                                })
                            })
                            res.send(createdChat.id);
                        }
                    })
                });
            }
        )
    }
)
