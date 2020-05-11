require('dotenv').config()

const express = require('express')   
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

app.get('/hello', (req, res) => {
    res.send(`hello`)
})
                 
app.listen(process.env.PORT || 3000)