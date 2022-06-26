const chatModel = require('../models/Chat');
const userModel = require("../models/User");

exports.createChat = ((req, res) => {
        const chat = req.body;
        userModel.find({username: chat.users[0]}).select(['_id']).then(function (usId, err) {
                let newUser1 = usId[0]._id.valueOf();

                userModel.find({username: chat.users[1]}).select(['_id']).then(function (usId2, err) {
                    chat.users = [newUser1, usId2[0]._id.valueOf()];

                    chatModel(chat).save((error, createdChat) => {
                        if (error) {
                            console.log(error)
                            res.send(error)
                        } else {
                            chat.users.forEach(us => {
                                userModel.findByIdAndUpdate(us, {$push: {"chats": createdChat.id}}).then(function (us, err) {
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
