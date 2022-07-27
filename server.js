// const express = require('express');
// const cors = require('cors');
let express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    database = require('./database'),
    bodyParser = require('body-parser');
const createError = require('http-errors');
const {createServer} = require("http");
const {Server} = require("socket.io");
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
app.use(bodyParser.urlencoded({extended: true}))


const jobOfferAPI = require('./routes/jobOffer');
const authAPI = require('./routes/auth');
const userAPI = require('./routes/user');
const chatAPI = require('./routes/chat');
app.use('/api/jobOffer', jobOfferAPI);
app.use('/api/auth', authAPI);
app.use('/api/user', userAPI);
app.use('/api/chat', chatAPI);


//handle messaging
//create websocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    //from https://stackoverflow.com/a/19150254
    socket.on('create', function (room) {
        if (!socket.rooms.has(room)) {
            socket.join(room);
        }
    });
    //when client send messages, send to other live user(s)
    socket.on('sendMessage', (message) => {
        socket.to(message.chat).emit("receiveMessage", message);
    })
    //force disconnect
    socket.on('forceDisconnect', () => {
        socket.disconnect(true);
    });
    //update contract
    socket.on('updateContract', (updatedContract) => {
        socket.to(updatedContract.chat).emit("updateContract", updatedContract);
    })
});

httpServer.listen(3002);

app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});