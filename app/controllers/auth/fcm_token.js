const User = require("../../models/users");

async function fcm_token(req, res) {
  const { user } = req;
  const { fcmToken: newToken } = req.body;

  let { fcmTokens } = await User.findOne({ _id: user.id });
  const findedFcmToken = fcmTokens.indexOf(newToken);

  if (findedFcmToken === -1) {
    fcmTokens.push(newToken);
    await User.findByIdAndUpdate(user.id, {
      fcmTokens,
    });
  }
  res.json({ status: 1, data: fcmTokens });
}

module.exports = fcm_token;
