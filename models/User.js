const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
        username: {
            type: String,
            unique: true,
        },
        password: String,
        profileBoost: Boolean,
        boost: Boolean,
        averageCustomerRating: Number,
        averageCraftsmanRating: Number,
        customerRatings: [
            {
                stars: Number,
                description: String,
                date: Date,
            }],
        craftsmanRatings: [
            {
                stars: Number,
                description: String,
                date: Date,
            }],
        settings: {
            name: String,
            address: String,
            birthday: Date,
            postalCode: Number,
            shortDescription: String,
            description: String,
            skills: [{value: String, label: String}]
        },
        profilePicture: {
            data: Buffer,
            contentType: String
        },
        chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}]
    },
    {collection: 'User'})

module.exports = User = mongoose.model('User', userSchema)
