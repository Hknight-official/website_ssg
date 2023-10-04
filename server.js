const express = require('express');
const {join} = require("path");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const User = require('./app/models/users')

// init express and socket io and env config
console.log("init system...")
const port = process.env.PORT_EXPRESS || 5000;
require('dotenv').config()
console.log('.env file loaded.')
const app = express();
const server = http.createServer(app);

// TODO: cors enable for development, please remove when build product
const cors = require('cors')
const axios = require("axios");
const {verify} = require("jsonwebtoken");
app.use(cors())


app.use(bodyParser.json())
app.use(express.json());
console.log('express loaded.');
const io = new Server(server, {
    cors: { // TODO: cors enable for development, please remove when build product
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// socket io
const supporting_room = [];
let supporter_online = [];
io.use(function(socket, next){
    // console.log(socket.handshake)
    if (socket.handshake.query && socket.handshake.query.token){
        verify(socket.handshake.query.token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
}).on('connection', function(client) {
    console.log(client.id+' Client connected...');
    // io.sockets.emit('supporter_update', supporter_online);
    client.on('join_room', async (args) => {
        // console.log(args.roomId)
        const { _id:id, name, email, role, avatar } = await User.findOne({_id: client.decoded.id});
        let isExist = false;
        // eslint-disable-next-line array-callback-return
        for (let value of supporter_online){
            if (value.id == id){
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            supporter_online.push({id, name, email, role, avatar})
        }
        io.sockets.emit('supporter_update', supporter_online);
        client.join(args.roomId)
    });

    client.on('disconnect', async () => {
        const { _id:id, name, email, role, avatar } = await User.findOne({_id: client.decoded.id});
        supporter_online = supporter_online.filter((e) => {
            // console.log(e.id, id, e.id !== id)
            return e.id == id
        });
        console.log(supporter_online)
        // io.sockets.emit('supporter_update', supporter_online);
        console.log(client.id+' Client disconnected...');
    })

    client.on("send_message", (args) => {
        // console.log(args)
        client.to(args.roomId).emit('receive_message', args)
    });

    client.on("typing_message", (args) => {
        // console.log(client.decoded.id)
        client.to(args.roomId).emit('start_typing_message', {})
        setTimeout(() => {
            client.to(args.roomId).emit('end_typing_message', {})
        }, 3000)
    });

    client.on("ai_support", async (args) => {
        if (supporting_room.includes(args[args.length-1].roomId)){
            return
        }
        io.to(args[args.length - 1].roomId).emit('start_typing_message', {})
        let listMessage = [{
            role: 'user',
            content: 'Bắt đầu cuộc hội thoại với tôi, bạn sẽ đóng vai là một chuyên gia hỗ trợ tâm lý.'
        }]
        for (let i = 0;i < args.length;i++){
            let role = 'assistant'
            if (args[i].isUser){
                role = 'user'
            }
            listMessage.push({role: role, content: args[i].context});
        }
        supporting_room.push(args[args.length-1].roomId)
        // let response = {}
        axios.post('https://gpt.hknight.dev/v1/chat/completions', {
            // model: "gpt-3.5-turbo-0613",
            messages: listMessage,
            temperature: 0.7
        }, {
            // timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Organization": `${process.env.OPENAI_ORG_KEY}`
            }
        }).then((response) => {
            io.to(args[args.length - 1].roomId).emit('end_typing_message', {})
            io.to(args[args.length - 1].roomId).emit('receive_message', {
                username: 'AI - FPsy',
                avatar: process.env.WEB_URL+'/images/avatar_ai.jpg',
                context: response.data.trim(),
                isUser: false,
                time: (new Date()).getTime()
            })
            let  index = supporting_room.indexOf(args[args.length-1].roomId);
            if (index !== -1) {
                supporting_room.splice(index, 1);
            }
        }).catch((e) => {
            console.log(e)
            io.to(args[args.length-1].roomId).emit('receive_message', {
                username: 'AI - FPsy',
                avatar: process.env.WEB_URL+'/images/avatar_ai.jpg',
                context: 'Hệ thống phản hồi AI đang quá tải vui lòng thử lại sau!',
                isUser: false,
                time: (new Date()).getTime()
            })
            io.to(args[args.length - 1].roomId).emit('end_typing_message', {})
        });


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
app.use(express.static('public'))
app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))

// route react binding
app.get("*", (_, res) => res.sendFile("index.html", { root: "build" }));

server.listen(port, () => console.log(`Listening on port ${port}`));