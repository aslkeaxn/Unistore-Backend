const { NODEMAILER, URL } = require("./config");
const nodemailer = require("nodemailer");
const { raiseError } = require("./helper");
const { Errors } = require("./enums");

async function sendEmailVerificationMail(email, code) {
    const text = `The verification code is: ${code}`;
    await Mailer.sendMail(email, text);
}
async function sendPasswordVerificationEmail(email, code) {
    const text = `Password reset code is: ${code}`;
    await Mailer.sendMail(email, text);
}

async function sendMail(to, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: NODEMAILER.SERVICE,
            host: NODEMAILER.HOST,
            auth: {
                user: NODEMAILER.EMAIL,
                pass: NODEMAILER.PASSWORD,
            },
        });

        const subject = "ShopApp Email Verification code";

        const mailOptions = {
            from: NODEMAILER.EMAIL,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        raiseError(500, error.message, Errors.MailerError);
    }
}

const Mailer = {
    sendEmailVerificationMail,
    sendPasswordVerificationEmail,
    sendMail,
};

module.exports = Mailer;
