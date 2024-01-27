const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { authMiddleware } = require("../middleware/middleware")
const { Account } = require("../database/db")
const router = express.Router()

router.use(cors())
router.use(authMiddleware)

router.get("/balance", async (req, res)=>{

    const account = await Account.findOne({userId: req.userID})
    res.status(200).json({balance: account.balance})
})


router.post("/transfer", async (req, res)=>{
    const session = await mongoose.startSession()

    session.startTransaction()

    const fromAccount = req.userID
    const toAccount = req.body.to
    const amount = req.body.amount

    const toAccountVerification = await Account.findOne({userId: toAccount}).session(session)
    if (!toAccountVerification){
        await session.abortTransaction()
        res.status(400).json({message: "Invalid account"})
    }


    const user = await Account.findOne({userId: fromAccount}).session(session)

    if (user.balance < amount){
        await session.abortTransaction()
        res.status(400).json({
            message: "Insufficient balance"
        })
        return
    }

    await Account.updateOne({userId: fromAccount}, {
        "$inc": {
            balance: -amount
        }
    }).session(session)

    await Account.updateOne({userId: toAccount}, {
            "$inc": {
                balance: amount
            }
    }).session(session)

    await session.commitTransaction()

    res.status(200).json({message: "Transaction successful"})
})










module.exports = router