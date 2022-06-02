// const express = require('express');
// const cors = require('cors');
let express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    database = require('./database'),
    bodyParser = require('body-parser');
const createError = require('http-errors');
require('dotenv').config();

// Connect mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
},
    error => {
        console.log("Database could't be connected to: " + error)
    }
)
const app = express();
const port = process.env.PORT || 5000;
// parse application/json
app.use(bodyParser.json({limit: '50mb'}))
// app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }))


const jobOfferAPI = require('./routes/jobOffer');
app.use('/api/jobOffer', jobOfferAPI);


app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});