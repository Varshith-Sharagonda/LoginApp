import { sender, recipients, transport } from "./config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: sender,
      to: email,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
      category: "Email Verification",
    };

    await transport.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: sender,
      to: user.email,
      subject: "Email Verification Successful",
      html: `<p>Welcome to our service! ${user.username}</p>
            <p>Thank you for verifying your email address.</p>
            <p>Best regards,</p>
            <p>The Auth Team</p>`,
    };

    const response = await transport.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
  }
};
