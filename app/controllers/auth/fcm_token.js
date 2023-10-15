const User = require("../../models/users");

async function fcm_token(req, res) {
  const { user } = req;
  const { fcmToken: newToken } = req.body;

  let { fcmToken } = await User.findOne({ _id: user.id });
  const findedFcmToken = fcmToken === newToken;

  if (!findedFcmToken) {
    await User.findByIdAndUpdate(user.id, {
      fcmToken: newToken,
    });
  }

  res.json({ status: 1, data: fcmToken });
}

module.exports = fcm_token;
