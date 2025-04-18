require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter;

if (process.env.NODE_ENV === 'development') {
  transporter = nodemailer.createTransport({
    host: process.env.MAILDEV_HOST,
    port: process.env.MAILDEV_PORT,
    ignoreTLS: true
  });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
}

const createMailOptions = (to, subject, text, html = '', attachments = []) => {
  return {
    from: process.env.MAIL_FROM,
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments
  };
};

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject('Error occurred: ' + error);
      } else {
        resolve('Email sent: ' + info.response);
      }
    });
  });
};

module.exports = {
  createMailOptions,
  sendMail
};
