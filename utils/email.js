// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const nodemailer = require('nodemailer');
const pug = require('pug');
const dotenv = require('dotenv');
const htmlToText = require('html-to-text');
// const validator = require('validator');

dotenv.config({ path: './config.env' });

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email,
    this.firstName = user.name.split(' ')[0];
    this.url = url,
    this.from = `Delightsome Asolo <${process.env.EMAIL_FROM}>`
  }

  newTransport(){
    if (process.env.NODE_ENV==='production'){
      //Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: `${process.env.EMAIL_HOST}`,
      port: process.env.EMAIL_PORT,
      secure: false, // use SSL
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
  }
});
}
 //Send the actual email
  async send(template, subject) {
// 1) Render HTML based on pug template
  const html = pug.renderFile(`${__dirname}/../Views/email/${template}.pug`,
  {
    firstName: this.firstName,
    url: this.url,
    subject,
  });
//2) Define email options
  const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text: htmlToText.convert(html)
  };

//3) Create a transport and send email
  await this.newTransport().sendMail(mailOptions);
}

  async sendWelcome(){
    await this.send('welcome', 'Welcome to the Natours Family!')
}};