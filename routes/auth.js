const { verify_user } = require("../authentication")
const express = require("express")
const router = express.Router()
const auth = require("../controller/auth.controller");


router.post("/signin", auth.signin);

router.post("/signup",
    [
        verify_user.checkDuplicateUsername,
    ],
    auth.signup
)


module.exports = router
