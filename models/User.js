const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    profileBoost: Boolean,
    settings: {
        name: String,
        address: String,
        birthday: Date,
        postalCode: Number,
        shortDescription: String,
        description: String,
        skills: [{ value: String, label: String }]
    },
    profilePicture: {
        data: Buffer,
        contentType: String
    },
},
    {
        collection: 'User'
    })

module.exports = User = mongoose.model('User', userSchema)
