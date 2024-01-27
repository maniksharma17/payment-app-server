const express = require("express")
const router = express.Router()


// middlewares
router.use(express.json())

// importing userRoute
const userRouter = require("./user")
router.use("/user", userRouter)

// importing accountRoute
const accountRouter = require("./account")
router.use("/account", accountRouter)


module.exports = router