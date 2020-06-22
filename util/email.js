const nodemailer = require("nodemailer");
// const sendgridTransport = require('nodemailer-sendgrid-transport');

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c20abaeb3f7cad",
    pass: "2b6cf5299eb484",
  },
});

exports.sendMail = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
