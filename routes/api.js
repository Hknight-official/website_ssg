const express = require('express')
const router = express.Router()
const ApiMiddleware = require('../app/middlewares/ApiMiddleware')
// middleware that is specific to this router
router.use(ApiMiddleware)


module.exports = router