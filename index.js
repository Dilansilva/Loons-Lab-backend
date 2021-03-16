const express = require('express')
const app = express();
const port = 4000;//port

const mongodb = require('mongodb');//mongodb package
const bcrypt = require('bcrypt');//for hashin

const MongoClient = mongodb.MongoClient;//initialize the connection
const connectionURL = 'mongodb://127.0.0.1:27017';//database server connection
const databaseName = 'Loons-Lab';//Database name

const main = require('./src/NodeMailer');//import nodemailer

let verifyCode = '';    

app.use(express.json());//json parser

app.post('/login', async (req, res) => {
    try {
        MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true },(error,client)=>{
            if(error){
                res.status(500).send();
            }
            const db = client.db(databaseName);//connect to specific database
                db.collection('User').findOne({user_email : req.body.email},(error,client) =>{
                    if(error){
                        res.status(500).send();
                    }if(client == null){
                        res.status(200).send('Invalid Email');
                    } if(client != null){
                        bcrypt.compare(String(req.body.password), String(client.user_password),function(err,result){
                            if(err){
                                res.status(500).send();
                            }if(result){//when passowrd is true
                                res.status(200).send('valid password');
                            }if(result == false){
                                res.status(200).send('invalid password');
                            }
                        });
                    }
                })
        })
    } catch (error) {
        res.status(500).send();
        console.log('errro');
    }
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
                                    res.status(201).send('successfully added');
                                        }
                        })
                    }
                })
        })
   } catch (error) {//if the error occur
    res.status(500).send();
   }
});

app.post('/emailverify',async (req,res) => {//email verification route
    
    try {
        if(req.body.email){
            const verificationCode = Math.floor((Math.random() * 100000) + 1);//genarate a random number
            verifyCode = verificationCode;
            main.main(req.body.email,verificationCode);//email sender
            res.send('succefully send email');
            
        } if(req.body.code){//if code is send
            if(verifyCode == req.body.code){//when code is verify succefully
                res.send('verify code!');
            } else {//when code is wrong
                res.send('Wrong code!');
            }
        }
    } catch (error) {
        res.status(500).send();
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})