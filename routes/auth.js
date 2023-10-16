const express = require("express");
const router = express.Router();

const Login_Controller = require("../app/controllers/auth/login");
const Logout_Controller = require("../app/controllers/auth/logout");

router.post("/google_login", Login_Controller);
router.post("/logout", Logout_Controller);

module.exports = router;
