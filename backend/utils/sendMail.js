const nodemailer = require('nodemailer');

const sendOTPEmail = async (toEmail, otp) => {
    // Replace these values with your actual SMTP info
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
            user: '958fb9d1bc2299',
            pass: 'f24d3511c32c2f' // Use app password if using Gmail
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    const mailOptions = {
        from: '"Repo_MQ" <958fb9d1bc2299>',
        to: toEmail,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${toEmail}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw new Error('Email sending failed');
    }
};

module.exports = sendOTPEmail;
