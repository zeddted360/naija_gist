const nodemailer = require('nodemailer');

const sendMail = async (myPassword, myEmail, email, subject, html) => {
  //create a transporter object
  const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    service:'gmail',
    auth: {
      user: myEmail,
      pass: myPassword,
    },
  });
  // send the mail
  try {
    const result = await transporter.sendMail({
      from: myEmail,
      to: email,
      subject: subject,
      html: html,
    });
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = sendMail;