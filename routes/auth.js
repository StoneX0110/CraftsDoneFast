const authJwt  = require("../authentication/auth")
const express = require("express")
const router = express.Router()
const { signin, signup } = require("../controllers/auth");


router.post("/signin", signin);

router.post("/signup",
    [
        authJwt.checkDuplicateUsername,
    ],
    signup
)


module.exports = router
