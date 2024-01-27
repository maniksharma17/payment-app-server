const jwtkey = process.env.JWT_SECRET_KEY
const jwt = require("jsonwebtoken")
require('dotenv').config();


function authMiddleware(req, res, next){
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')){
        res.json({})
    }

    token = header.split(" ")[1]
 
    try {
        const verifiedJWT = jwt.verify(token, jwtkey)
        req.userID = verifiedJWT.userID
        next()
    } catch(err) {
        res.json({})
    }
}

module.exports = {
    authMiddleware
}