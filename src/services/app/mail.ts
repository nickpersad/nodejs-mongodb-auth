const nodemailer = require("nodemailer");

module.exports = {
    send: async (sendTo: string) => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Nick Persad" <hi@nickpersad.com>', // sender address
            to: sendTo, // list of receivers
            subject: "Thank you for signing up ✔", // Subject line
            text: "Thank you for signing up to my demo app", // plain text body
            html: "<b>Thank you for signing up to my demo app</b>" // html body
        });

        if (info.accepted[0] === sendTo) {
            return { success: true };
        }
        return { success: false, msg: info.response };
    }
};