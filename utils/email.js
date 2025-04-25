// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// const validator = require('validator');

dotenv.config({ path: './config.env' });

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: `${process.env.EMAIL_USERNAME}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: 'yourusername@email.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3. Actually send mail
  // await transporter.sendMail(options);
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
