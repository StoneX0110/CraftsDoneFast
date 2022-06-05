const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    password: String,
    profileBoost: Boolean,
    settings: {
        name: String,
        address: String,
        birthday: Date,
        postalCode: Number,
        shortDescription: String,
        description: String,
    },
    profilePicture: {
        data: Buffer,
        contentType: String
    },
    timestamps: true
},
    {
        collection: 'User'
    })

module.exports = mongoose.model('User', userSchema)
