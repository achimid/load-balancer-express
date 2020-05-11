const body = require('body-parser');
const express = require('express');
   
const app1 = express();
const app2 = express();

app1.use(body.json());
app2.use(body.json());
   
const handler = serverNum => (req, res) => {
 res.send(`hello`);
};

app1.get('/hello2', handler(1))
app2.get('/hello2', handler(2))
                 
app1.listen(3000);
app2.listen(3001);