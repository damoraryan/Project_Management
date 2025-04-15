const mailer = require("nodemailer");

const sendingMail = async (to, subject, htmlContent) => {
    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "mernstack262@gmail.com",
            pass: "fmit bbth szxf nimm", // Ensure this is an App Password, not your real password!
        },
    });

    const mailOptions = {
        from: "mernstack262@gmail.com", // ✅ Corrected "from"
        to: to,
        subject: subject,
        html: htmlContent, // ✅ Use `htmlContent` instead of `text`
    };

    try {
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse);
        return mailResponse;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendingMail };
