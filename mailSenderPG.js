/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-extraneous-require */
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: `${process.env.EMAIL_USERNAME}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

console.log(process.env.EMAIL_PASSWORD);

// Configure the mailoptions object
const mailOptions = {
  from: 'yourusername@email.com',
  to: 'yourfriend@email.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(`Error: ${error}`);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});
