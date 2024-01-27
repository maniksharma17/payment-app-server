const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://maniksharma:RGDpvmz7vk0DQ2d0@cluster0.jgjskjb.mongodb.net/paytm")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 20
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
})

const accountsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

userSchema.pre('save', function(next){
    //capitialise
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase()
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase()
    next()
})


const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountsSchema)

module.exports = { User, Account }