const chatModel = require('../models/Chat');
const userModel = require("../models/User");
const messageModel = require("../models/Message");
const contractModel = require("../models/Contract")

exports.createChat = ((req, res) => {
    const chat = req.body;
    const contract = {
        price: '',
        startingDate: '',
        paymentStatus: 'noPayment',
    }

    userModel.find({username: chat.users.craftsman}).select(['_id']).then(function (usId, err) {
        let newCraftsman = usId[0]._id.valueOf();

        userModel.find({username: chat.users.client}).select(['_id']).then(function (usId2, err) {
            chat.users = {craftsman: newCraftsman, client: usId2[0]._id.valueOf()};

            contractModel(contract).save((err, createdContract) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    chat.contract = createdContract._id.valueOf();
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
                }
            });
        });
    });
});


// returns all chats of a specific user with additional info (username of chat partners)
    exports.getMyChats = ((req, res) => {
        userModel.findById(req.userId).select(['chats', 'username']).then(function (userInfo) {
            let chatIds = userInfo.chats.map((chatObjectId) => {
                return chatObjectId.valueOf()
            });

            let chatsWithMessages = [];
            //counter to only send when both chats are received
            let chatCounter = 0;
            //add each chat without messages to result
            chatIds.forEach(chatId => {
                chatModel.findById(chatId).then(async function (resultChat, err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        //add messages to chat
                        let messages = [];
                        let msgCounter = 0;
                        for (const msgId of resultChat.messages) {
                            let messageId = msgId.valueOf();
                            await messageModel.findById(messageId).select(['-chat']).then(function (message, err) {
                                if (err) {
                                    console.log(err);
                                    res.send(err);
                                } else {
                                    messages.push(message);
                                    msgCounter++;
                                    if (msgCounter === resultChat.messages.length) {
                                        resultChat.messages = messages;
                                    }
                                }
                            })
                        }
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
                            chatsWithMessages.push({chat: resultChat, partnerUsername: partnerUsername});
                            chatCounter++;
                            //if all chats are included, send result
                            if (chatCounter === chatIds.length) res.send(chatsWithMessages);
                        })

                    }
                })
            })
        })
    });

    exports.postMessageToChat = ((req, res) => {
        let message = req.body;
        messageModel(message).save((err, createdMessage) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                chatModel.findByIdAndUpdate(createdMessage.chat, {$push: {"messages": createdMessage._id.valueOf()}}).then(function (us, err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                })
            }
        })
    });

//TODO: aktuell wir immer noch ein neuer Contract erstell selbst wenn schon einer besteht -> der alte wird nur nicht mehr referenziert und exestiert aber noch dieser muss gelöscht werden
    /* Lösungsansatz 1: wir holen immer den contract und tauschen werte aus oder
       Lösungsansatz 2: wir löschen den alten
       Lösungsansatz 3: wir checken ob schon ein contract besteht und holen uns dann den alten contract direkt im popup und updaten diesen
     */
    exports.createContract = ((req, res) => {
        const contract = req.body;
        const chatID = req.body.chatID;

        contractModel(contract).save((err, createdContract) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                chatModel.findByIdAndUpdate(chatID, {$set: {"contract": createdContract._id.valueOf()}}).then(function (us, err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                })
            }
        })
    });

    exports.updateContract = ((req, res) => {
        const contract = req.body;
        contractModel.findByIdAndUpdate(contract._id, {$set: contract}).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send(job);
            }
        })
    });

    exports.updateContractDetails = ((req, res) => {
        const contract = req.body;
        contractModel.findByIdAndUpdate(contract._id, {
            $set: {
                "price": contract.price,
                "startingDate": contract.startingDate
            }
        }).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send(job);
            }
        })
    });

    exports.updateContractStatus = ((req, res) => {
        const contract = req.body;
        contractModel.findByIdAndUpdate(contract._id, {$set: {"paymentStatus": contract.paymentStatus}}).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send(job);
            }
        })
    });

    exports.getContract = ((req, res) => {
        chatModel.find({_id: req.params.id}).populate('contract', {contractID: req.params.id}).then(function (job) {
            res.send(job[0]);
        })
    });

    exports.deleteContract = ((req, res) => {
        chatModel.findByIdAndRemove(req.params.id).then(function (job, err) {
            if (err) {
                console.log(error);
                res.send(error);
            } else {
                res.send("deleted");
            }
        })
    });
/*
kept here for potential changes in the future

exports.getMessagesFromChatId = ((req, res) => {
    chatModel.findById(req.params.chatId).select(['messages']).then(async function (messageIds, err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            let messages = [];
            let msgCounter = 0;
            for (const msgId of messageIds.messages) {
                let messageId = msgId.valueOf();
                await messageModel.findById(messageId).select(['-chat']).then(function (message, err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        messages.push(message);
                        msgCounter++;
                        if (msgCounter === messageIds.messages.length) {
                            res.send(messages);
                        }
                    }
                })
            }
        }
    })
});
 */
