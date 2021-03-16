const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
function main(email,code) {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uorgroup7@gmail.com', // senders mail
      pass: 'uoruorgroup7', // sender password
    },
  }); 


  // send mail with defined transport object
  let info = transporter.sendMail({
    from: 'uorgroup7@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Email Verification code", // Subject line
    text: `This is your email verification code ${code} ,Enter this code and and log in to your account`, // plain text body
  });

}

module.exports = {main}