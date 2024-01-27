// importing packages
const express = require("express");
const cors = require("cors")
const app = express()
require('dotenv').config();
const PORT = process.env.PORT

// middlewares
app.use(cors())
app.use(express.json())

// routing
const rootRouter = require("./routes/index")
app.use("/api/v1", rootRouter)


// listening on PORT
app.listen(PORT, ()=>{
    console.log("Listening on PORT 3000")
})