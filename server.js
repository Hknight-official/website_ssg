const express = require('express');
const {join} = require("path");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");

const md5 = require('md5')



// init express and socket io and env config
console.log("init system...")
const port = process.env.PORT_EXPRESS || 5000;
require('dotenv').config()
console.log('.env file loaded.')
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json())
console.log('express loaded.');
const io = new Server(server);
// socket io
io.on('connection', function(client) {
    console.log(client.id+' Client connected...');
    client.on('join_room', (args) => {
        client.join(md5(1))
    });

    client.on("send_message", (args) => {
        client.to(md5(1)).emit('receive_message', args)
    });
});

console.log('socket.io loaded.');


// mongodb
console.log("connecting mongodb...");
mongoose.connect(process.env.MONGODB_CONNECT, {
    useMongoClient: true,
});
console.log("connected mongodb success");


// routes init
app.use(express.static(join(__dirname, 'build')));
const apiRoute = require('./routes/api')
app.use('/api', apiRoute)

// route react binding
app.get("*", (_, res) => res.sendFile("index.html", { root: "build" }));

server.listen(port, () => console.log(`Listening on port ${port}`));