require("dotenv").config();

const nodemailer = require("nodemailer");

const host = process.env.ZEPTOMAIL_HOST;
const port = Number(process.env.ZEPTOMAIL_PORT);
const user = process.env.ZEPTOMAIL_API_USER;
const pass = process.env.ZEPTOMAIL_API_KEY;

// console.log("Host:", host);
// console.log("Port:", port);
// console.log("User:", user);
// console.log("Password length:", pass.length);

const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
        user,
        pass
    },
    logger: true,
    debug: true
});

transporter.verify((err, success) => {
    if (err) {
        console.error("Verification Failed");
        console.error(err);
    } else {
        console.log("SMTP Authentication Successful");
        console.log(success);
    }
});