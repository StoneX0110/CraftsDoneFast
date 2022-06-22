const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chat'},
    price: Number,
    startingDate: Date,
    paymentStatus: String
});

module.exports = Contract = mongoose.model('contract', ContractSchema);