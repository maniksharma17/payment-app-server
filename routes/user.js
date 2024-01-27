const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
require('dotenv').config();
const jwtkey = process.env.JWT_SECRET_KEY
const router = express.Router()
const { User, Account } = require("../database/db")
const { authMiddleware } = require("../middleware/middleware")
const { signupSchema, signinSchema, updateSchema } = require("../auth/userSchema")

router.use(cors())
console.log(jwtkey)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Add any necessary logging or cleanup logic here
  });

// signup route
router.post("/signup", async (req, res)=>{
    const userData = req.body
    const parsedUserData = signupSchema.safeParse(userData)

    if (parsedUserData.success){
        const existingUser = await User.findOne({username: userData.username})
    
        if (existingUser){
            res.status(200).json({message: "Username already exixts.", error: true})
            

        } else{
            User.create({
                username: userData.username,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            }).then((user)=>{
                const userID = user._id
                const token = jwt.sign({userID}, jwtkey)

                Account.create({
                    userId: user._id,
                    balance: Math.floor(Math.random() * 10000)
                })


                res.status(200).json({
                    message: "User created successfully",
                    token: token
                    })
                return
                })

           
        }
    }
    else {
        res.json({parsedUserData, parseError: true})
        return
    }
})

// signin route
router.post("/signin", async (req, res)=>{
    const userData = req.body
    
    if (!(signinSchema.safeParse(userData).success)){
        res.status(411).json({
            message: "Invalid username / password", error: true
        })
        return
    }

    const existingUser = await User.findOne({username: userData.username, password: userData.password})

    if (existingUser){
        const token = jwt.sign({userID: existingUser._id}, jwtkey)
        res.status(200).json({
            token: token, firstName: existingUser.firstName
        })
    } else{
        res.status(411).json({
            message: "Username / password does not exist.", error: true
        })
    }
})

// update route
router.put("/", authMiddleware, async (req, res)=>{
    const userID = req.userID
    const userData = req.body

    const parsedUserData = updateSchema.safeParse(userData)
    if (!(parsedUserData.success)){
        res.json({message: parsedUserData.error.issues[0].message})
    }

    await User.updateOne({_id: userID}, {
        "$set":{
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName
        }
    })

    res.json({message: "Updated successfully."})
})

// all users route
router.get("/bulk", authMiddleware, (req, res)=>{
    const filter = req.query.filter || "";

    User.find({
        $or: [
            {firstName: {
                "$regex": filter
            }},
            {lastName: {
                "$regex": filter}}
        ]})
        .then((users)=>{
        
            res.json({
                users: users.map(user => ({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    _id: user._id
                }))
            }) 
    })

})

router.get("/getUser", authMiddleware, async (req, res) => {
    const userid = req.query.id

    const user = await User.findOne({_id: userid})
    res.json({user})
})

module.exports = router