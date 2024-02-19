require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: subject,
      html: text,
    });
    return info;
  } catch (error) {
    throw error;
  }
};

const sendResetPasswordEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: subject,
      text: text,
    });
    return info;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  sendEmail,
  sendResetPasswordEmail,
};
