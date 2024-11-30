const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

if (!process.env.RESEND_API) {
    console.error("Provide RESEND_API in the .env file");
    process.exit(1); // Exit if the API key is missing
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Blinket <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Failed to send email:", error);
            return { success: false, error };
        }

        return { success: true, data };

    } catch (err) {
        console.error("Error in sendEmail:", err);
        return { success: false, error: err };
    }
};

module.exports = sendEmail;
