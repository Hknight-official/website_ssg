const express = require('express')
const router = express.Router()
const AuthMiddleware = require('../app/middlewares/AuthMiddleware')
const UserInfo_Controller = require("../app/controllers/auth/user_info");
const GPT_Controller = require("../app/controllers/gpt/gpt_request");
// middleware that is specific to this router
router.use(AuthMiddleware)

router.get('/user_info', UserInfo_Controller)
router.post('/gpt_support', GPT_Controller)

module.exports = router