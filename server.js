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

app.get('/hellof', (req, res) => {
    res.send(`hello - ` + fibonacci(20))
})

function fibonacci(num) {
    if (num <= 1) return 1;
  
    return fibonacci(num - 1) + fibonacci(num - 2);
}
                 
app.listen(process.env.PORT || 3000)