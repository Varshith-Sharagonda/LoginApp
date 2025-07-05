import Nodemailer from 'nodemailer';
import { MailtrapTransport  } from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();


const TOKEN = process.env.MAILTRAP_TOKEN;

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: 'hello@demomailtrap.co',
  name: 'Mailtrap Test',
};
const recipients = [
  'varshith.rede96@gmail.com',
];
const name = 'Test_Name';
transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: 'Email Verification Successful',
    html: `<p>Welcome to our service! ${name}</p>
    <p>Thank you for verifying your email address.</p>
    <p>Best regards,</p>
    <p>The Team</p>`,

    // text: "Welcome to our service!", // Optional plain text content
    category: 'Greeting',
  })
  .then(console.log, console.error);