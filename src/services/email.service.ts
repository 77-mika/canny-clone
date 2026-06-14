import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string,
): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    await transporter.verify();
    console.log("SMTP connection successful");

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const info = await transporter.sendMail({
        from: `"Canny Clone" <${process.env.MAIL_FROM}>`,
        to,
        subject: "Password Reset Request",
        text: `Reset your password here: ${resetUrl} (expires in 15 minutes)`,
        html: `
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the link below.</p>
            <p>Expires in <strong>15 minutes</strong>.</p>
            <a href="${resetUrl}" style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 16px 0;
            ">Reset Password</a>
            <p>If you didn't request this, ignore this email.</p>
        `,
    });

    console.log("Preview email at:", nodemailer.getTestMessageUrl(info));
};
