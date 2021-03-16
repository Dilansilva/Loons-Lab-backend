const express = require('express')
const app = express();
const port = 4000;//port

const mongodb = require('mongodb');//mongodb package
const bcrypt = require('bcrypt');//for hashin

const MongoClient = mongodb.MongoClient;//initialize the connection
const connectionURL = 'mongodb://127.0.0.1:27017';//database server connection
const databaseName = 'Loons-Lab';//Database name

app.use(express.json());//json parser

app.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Hello World');
})

app.post('/signup', async (req, res) => {

   try {
        //salt and hashed the password
        const salt = await bcrypt.genSalt(10);//generate a 10 salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);//hash the password with salt
        
        MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error,client) => {
            
        })
   } catch (error) {
    res.status(500).send();
   }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})