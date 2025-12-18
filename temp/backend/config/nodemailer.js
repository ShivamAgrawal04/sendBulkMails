import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: "me@gmail.com",
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465, // 465 for secure SMTP
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: "your.email@gmail.com", // your Gmail
//     pass: "yourAppPassword",      // Gmail app password (not your regular password)
//   },
// });

const companyName = "Shivam Agrawal";
const gmailID = "shivamagrawal0455@gmail.com";
const GOOGLE_APP_PASSWORD = "utnenpmopaynbxwt";
const subject = "";
const text = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shivamagrawal0455@gmail.com",
    pass: GOOGLE_APP_PASSWORD,
  },
});

const mailOptions = {
  from: `"${companyName}" <${gmailID}>`,
  to: "learncoding0455@gmail.com",
  subject: "Hello",
  text: "This is a test email",
  html: "<b>This is a test email</b>",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("Error sending email:", err);
  } else {
    console.log("Email sent:", info.response);
  }
});

export default transporter;
