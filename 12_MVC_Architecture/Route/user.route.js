const express = require('express')
const { getUser, postUser } = require('../Controller/user.controller');
const router = express.Router();

router.get("/user", getUser)
router.post("/user", postUser)

module.exports = router