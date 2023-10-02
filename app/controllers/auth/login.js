const {OAuth2Client} = require('google-auth-library');

const User = require('../../models/users')
const {sign} = require("jsonwebtoken");
async function Login(req, res){
    const client = new OAuth2Client();
    const {token} = req.body;
    if (!token){
        res.json({status: 2, message: 'token can not empty.'});
        return;
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '28119552172-9c9fj78fmjj0ldhg0m2sq991dpa3oqis.apps.googleusercontent.com',
    });
    const { email, name, picture, sub: googleid } = ticket.getPayload();

    let checkUserExist = await User.findOne({googleId: googleid});
    if (!checkUserExist){
        checkUserExist = new User({
            name,
            email,
            googleId: googleid,
            avatar: picture
        });
        try {
            await checkUserExist.save();
        } catch (err) {
            await res.json({status: 2, message: 'Có lỗi xảy ra vui lòng thử lại.'});
            return;
        }
    }
    await User.updateOne({googleId: googleid}, { avatar: picture });

    let token_jwt = sign({id: checkUserExist._id}, process.env.JWT_SECRET);
    // console.log(checkUserExist.id)

    await res.json({status: 1, message: 'Đăng nhập thành công.', token: token_jwt});

}

module.exports = Login