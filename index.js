const express = require('express')
const app = express();
const port = 4000;//port

const mongodb = require('mongodb');//mongodb package
const bcrypt = require('bcrypt');//for hashin

app.use(express.json());//json parser

app.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Hello World');
})

app.post('/signup', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})