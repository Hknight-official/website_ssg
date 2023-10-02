const express = require('express')
const router = express.Router()

const Login_Controller = require("../app/controllers/auth/login");


router.post('/google_login', Login_Controller)


module.exports = router