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
        chat: null
    }
    //get craftsman ID
    userModel.find({username: chat.users.craftsman}).select(['_id']).then(function (usId, err) {
        let newCraftsman = usId[0]._id.valueOf();
        //get client ID
        userModel.find({username: chat.users.client}).select(['_id']).then(function (usId2, err) {
            chat.users = {craftsman: newCraftsman, client: usId2[0]._id.valueOf()};
            //save contract (still without chat ID)
            contractModel(contract).save((err, createdContract) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    //create chat including contract ID
                    chat.contract = createdContract._id.valueOf();
                    chatModel(chat).save((error, createdChat) => {
                        if (error) {
                            console.log(error)
                            res.send(error)
                        } else {
                            //update users to include chat ID
                            Object.keys(chat.users).forEach(key => {
                                userModel.findByIdAndUpdate(chat.users[key], {$push: {"chats": createdChat.id}}).then(function (us, err) {
                                    if (err) {
                                        console.log(err);
                                        res.send(err);
                                    }
                                })
                            })
                            //update contract to include chat ID
                            contractModel.findByIdAndUpdate(createdContract._id.valueOf(), {$set: {'chat': createdChat}}).then(function (updatedContract, err) {
                                if (error) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    console.log(updatedContract);
                                }
                            });
                            //send ID of created chat
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
            //add each chat to result
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
        const chatID = req.body.chat;

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
        contractModel.findByIdAndUpdate(contract._id, {$set: contract}).then(function (updatedContract, err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(updatedContract);
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
        contractModel.findById(req.query.contractId).then(function (contr, err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(contr);
            }
        })
    });

    exports.getContractsFromIdArray = (async (req, res) => {
        let contractsArray = [];
        //console.log(req.body);
        for (const contractId of req.query.idArray) {
            await contractModel.findById(contractId).then((contr, err) => {
                contractsArray.push(contr);
            })
        }
        res.send(contractsArray);
    });

    exports.deleteContract = ((req, res) => {
        contractModel.findByIdAndRemove(req.params.id).then(function (job, err) {
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
