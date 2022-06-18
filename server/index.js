require('dotenv')
const express = require('express')
const cors = require('cors')
const app = express()

const {
    NODE_ENV, 
    PORT
} = process.env

app.use(express.json())
app.use(cors());

app.get("/", (req, res) => {
    return res.json({
        success:true,
        message: "OK",
        data: {}
    })
})

app.listen(PORT, "0.0.0.0", () => console.log(`Server started`))