const User = require("../../models/users");

async function Logout(req, res) {
  const { userId, fcmToken } = req.body;

  if (!userId)
    return res.json({ status: 2, message: "User Id can not empty." });

  let { fcmTokens } = await User.findOne({ _id: userId });

  fcmTokens = fcmTokens?.filter((token) => token !== fcmToken) ?? [];

  await User.findByIdAndUpdate(userId, {
    fcmTokens,
  });

  await res.json({
    status: 1,
    message: "Đăng xuất thành công.",
  });
}

module.exports = Logout;
