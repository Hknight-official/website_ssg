const express = require("express");
const { join } = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./app/models/users");
const Messages = require("./app/models/messages");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// init express and socket io and env config
console.log("init system...");
const port = process.env.PORT_EXPRESS || 5000;
require("dotenv").config();
console.log(".env file loaded.");
const app = express();
const server = http.createServer(app);

// TODO: cors enable for development, please remove when build product
const cors = require("cors");
const axios = require("axios");
const { verify } = require("jsonwebtoken");
const {
  sendNotificationToSupporter,
  findUsersByRoomId,
  sendNotificationToUser,
} = require("./app/utils/helpers");
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
console.log("express loaded.");
const io = new Server(server, {
  cors: {
    // TODO: cors enable for development, please remove when build product
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// socket io
const supporting_room = [];

io.use(function (socket, next) {
  // console.log(socket.handshake)
  if (socket.handshake.query && socket.handshake.query.token) {
    verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", function (client) {
  console.log(client.id + " Client connected...");
  // io.sockets.emit('supporter_update', supporter_online);
  client.on("join_room", async (args) => {
    // console.log(args.roomId)
    await User.update(
      { _id: client.decoded.id },
      { online: 1 },
      { upsert: true }
    );
    const listUserOnline = await User.find({ online: 1 });
    let isExist = false;
    // eslint-disable-next-line array-callback-return
    let supporter_online = [];
    for (let value of listUserOnline) {
      supporter_online.push({
        id: value.id,
        supporter: value.supporter,
        name: value.name,
        email: value.email,
        role: value.role,
        avatar: value.avatar,
      });
    }
    let user = await User.findOne({ _id: client.decoded.id });
    io.sockets.emit("supporter_update", supporter_online);
    client.join(args.roomId);
    if (user.role === 1 && args.roomId) {
      let checkisSupporting = await User.find({ _id: args.roomId });
      if (!checkisSupporting.supporter) {
        await User.update(
          { _id: args.roomId },
          { supporter: client.decoded.id },
          { upsert: true }
        );
      }
      let messages = await Messages.find({ roomId: args.roomId }, null, {
        sort: { time: "asc" },
        limit: 20,
      });
      io.to(args.roomId).emit("init_messages", messages);
    }
    // console.log(supporter_online)
    // client.to(args.roomId).emit('supporter_update', supporter_online);
  });

  client.on("disconnect", async () => {
    await User.update(
      { _id: client.decoded.id },
      { online: 0 },
      { upsert: true }
    );
    const listUserOnline = await User.find({ online: 1 });
    let supporter_online = [];
    let role = 0;
    for (let value of listUserOnline) {
      if (value._id === client.decoded.id) {
        role = value.role;
      }
      supporter_online.push({
        id: value.id,
        name: value.name,
        email: value.email,
        role: value.role,
        avatar: value.avatar,
      });
    }

    if (role === 1) {
      await User.update(
        { supporter: client.decoded.id },
        { supporter: null },
        { upsert: true }
      );
    }

    await Messages.updateMany(
      { idUser: client.decoded.id, status: 0 },
      { $set: { status: 1 } }
    );

    // console.log(supporter_online)
    io.sockets.emit("supporter_update", supporter_online);
    console.log(client.id + " Client disconnected...");
  });

  client.on("send_message", async (args) => {
    if (args.roomId) {
      let createMessages = new Messages({ idUser: client.decoded.id, ...args });
      await createMessages.save();

      // Send Notifications
      if (args.isUser) sendNotificationToSupporter(client.decoded.id);
      else {
        const userIds = await findUsersByRoomId(args.roomId);
        await sendNotificationToUser(userIds);
      }
    }
    client.to(args.roomId).emit("receive_message", args);
  });

  client.on("typing_message", (args) => {
    // console.log(client.decoded.id)
    client.to(args.roomId).emit("start_typing_message", {});
    setTimeout(() => {
      client.to(args.roomId).emit("end_typing_message", {});
    }, 3000);
  });

  client.on("ai_support", async (args) => {
    if (supporting_room.includes(args[args.length - 1].roomId)) {
      return;
    }

    io.to(args[args.length - 1].roomId).emit("start_typing_message", {});
    let listMessage = [
      {
        role: "user",
        content:
          "Bắt đầu cuộc hội thoại với tôi, bạn sẽ đóng vai là một chuyên gia hỗ trợ tâm lý ứng dụng GPT-4 không phải GPT-3",
      },
    ];
    for (let i = 0; i < args.length; i++) {
      let role = "assistant";
      if (args[i].isUser) {
        role = "user";
      }
      if (args[i]?.content?.split("")?.length <= 255) {
        // if text too long dont take
        listMessage.push({ role: role, content: args[i].context });
      }
    }
    supporting_room.push(args[args.length - 1].roomId);
    // let response = {}
    const gpt_support = require("./app/controllers/gpt/gpt_support");
    let response = await gpt_support.getGPT(listMessage);
    if (!response) {
      io.to(args[args.length - 1].roomId).emit("receive_message", {
        username: "AI - FPsy",
        avatar: process.env.WEB_URL + "/images/avatar_ai.jpg",
        context: "Hệ thống phản hồi AI đang quá tải vui lòng thử lại sau!",
        isUser: false,
        time: new Date().getTime(),
      });
      io.to(args[args.length - 1].roomId).emit("end_typing_message", {});
    } else {
      io.to(args[args.length - 1].roomId).emit("end_typing_message", {});

      let arg_mess = {
        username: "AI - FPsy",
        avatar: process.env.WEB_URL + "/images/avatar_ai.jpg",
        context: response.trim(),
        isUser: false,
        time: new Date().getTime(),
      };

      io.to(args[args.length - 1].roomId).emit("receive_message", arg_mess);

      let createMessages = new Messages({
        idUser: client.decoded.id,
        ...arg_mess,
      });
      await createMessages.save();
    }

    let index = supporting_room.indexOf(args[args.length - 1].roomId);
    if (index !== -1) {
      supporting_room.splice(index, 1);
    }
  });
});

console.log("socket.io loaded.");

// mongodb
console.log("connecting mongodb...");
mongoose.connect(process.env.MONGODB_CONNECT, {
  useMongoClient: true,
});
console.log("connected mongodb success");

// routes init

app.use(express.static(join(__dirname, "build")));
app.use(express.static("public"));
app.use("/api", require("./routes/api"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

// route react binding
app.get("*", (_, res) => res.sendFile("index.html", { root: "build" }));

server.listen(port, () => console.log(`Listening on port ${port}`));
