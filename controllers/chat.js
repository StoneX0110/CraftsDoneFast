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

// returns all chats of a specific user with additional info (username of chat partners)
exports.getMyChats = ((req, res) => {
    userModel.findById(req.userId).select(['chats', 'username']).then(function (userInfo) {
        let chatIds = userInfo.chats.map((chatObjectId) => {
            return chatObjectId.valueOf()
        });

        let chatsWithoutMessages = [];
        //counter to only send when both chats are received
        let chatCounter = 0;
        //add each chat without messages to result
        chatIds.forEach(chatId => {
            chatModel.findById(chatId).select(['-messages']).then(function (resultChat, err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    //add partner username to result
                    let partnerId = '';
                    let partnerUsername = '';
                    //set partner id to id of chat participant that isn't us
                    if (req.userId.toString() === resultChat.users.craftsman.toString()) {
                        partnerId = resultChat.users.client;
                    } else {
                        partnerId = resultChat.users.craftsman;
                    }
                    userModel.findById(partnerId).select(['username']).then(function (username) {
                        partnerUsername = username.username;
                        chatsWithoutMessages.push({chat: resultChat, partnerUsername: partnerUsername});
                        chatCounter++;
                        //if all chats are included, send result
                        if (chatCounter === chatIds.length) res.send(chatsWithoutMessages);
                    })

                }
            })
        })
    })
});
