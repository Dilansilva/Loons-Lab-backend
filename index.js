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
            if(error){//if error occur
                res.status(500).send();
            } 

            const db = client.db(databaseName);//connect to specific database
                db.collection('User').findOne({user_email : req.body.email},(error,result) => {
                    if(error) {res.status(500).send}

                    if(result != null) {//if email in use
                        res.send('Email is in use');//send the response
                    }

                    if(result == null){//if email is not use
                        db.collection('User').insertOne({//insert the record after validation
                            user_email : req.body.email,
                            user_password : hashedPassword
                        },(error, result) => {
                            if(error){
                                res.status.send();
                            }
                            if(result){
                                res.status(201).send('Successfully Added');
                            }
                        })
                    }
                })
        })
   } catch (error) {//if the error occur
    res.status(500).send();
   }
});

app.post('/emailverify',(req,res) => {//email verification route
    
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})