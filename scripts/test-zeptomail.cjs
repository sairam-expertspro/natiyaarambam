require("dotenv").config();

const nodemailer = require("nodemailer");

const host = process.env.ZEPTOMAIL_HOST;
const port = Number(process.env.ZEPTOMAIL_PORT);
const user = process.env.ZEPTOMAIL_API_USER;
const pass = process.env.ZEPTOMAIL_API_KEY;

if (!host || !port || !user || !pass) {
    console.error(
        "Missing ZeptoMail environment variables. Set ZEPTOMAIL_HOST, ZEPTOMAIL_PORT, ZEPTOMAIL_API_USER, and ZEPTOMAIL_API_KEY."
    );
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
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
        process.exit(1);
    } else {
        console.log("SMTP Authentication Successful");
        console.log(success);
        process.exit(0);
    }
});
