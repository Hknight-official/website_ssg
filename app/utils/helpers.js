const mongoose = require("mongoose");
const FCM = require("fcm-node");
const User = require("../models/users");
const Messages = require("../models/messages");

const fcmAccountKey = process.env.REACT_APP_FCM_ACCOUNT_KEY;
console.log(fcmAccountKey);
const fcm = new FCM(fcmAccountKey);

const sendNotification = (data, fcmTokens) => {
  fcmTokens?.forEach((fcmToken) => {
    fcm.send(
      {
        to: fcmToken,
        notification: data,
      },
      (err, resp) => {
        if (err) console.log(err);
        else console.log(resp);
      }
    );
  });
};

const getListSupporter = async () => {
  const users = await User.find({
    role: 1,
    online: 1,
  });

  return users;
};

const sendNotificationToSupporter = async (clientId) => {
  const user = await User.findById(clientId);
  const notificationData = {
    title: "Tin nhắn mới",
    body: "Bạn có 1 tin nhắn mới",
  };
  //   Check If user has a supporter, send notification to supporter
  //  If not, send notification to supporters
  if (user.supporter) {
    const supporter = await User.findById(user.supporter);
    sendNotification(notificationData, supporter.fcmTokens);
  } else {
    const supporters = await getListSupporter();
    supporters?.forEach((supporter) => {
      sendNotification(notificationData, supporter.fcmTokens);
    });
  }
};

const findUsersByRoomId = async (roomId) => {
  const userIds = [];

  const messages = await Messages.find({
    roomId,
    isUser: true,
  });

  messages?.forEach((message) => {
    userIds.push(message.idUser);
  });
  return [...new Set(userIds)];
};

const sendNotificationToUser = async (userIds) => {
  if (!userIds?.length) return;

  const objectIds = userIds?.map((userId) => {
    return mongoose.Types.ObjectId(userId);
  });

  const users = await User.find({
    _id: {
      $in: objectIds,
    },
  });

  const notificationData = {
    title: "Tin nhắn mới ",
    body: "Bạn có 1 tin nhắn mới từ tư vấn viên",
  };

  users?.forEach((user) => {
    sendNotification(notificationData, user.fcmTokens);
  });
};

module.exports = {
  sendNotification,
  sendNotificationToSupporter,
  sendNotificationToUser,
  findUsersByRoomId,
};
