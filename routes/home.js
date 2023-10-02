const express = require('express')
const router = express.Router()
const AuthMiddleware = require('../app/middlewares/AuthMiddleware')
const UserInfo_Controller = require("../app/controllers/auth/user_info");
// middleware that is specific to this router
router.use(AuthMiddleware)

router.post('/user_info', UserInfo_Controller)

module.exports = router