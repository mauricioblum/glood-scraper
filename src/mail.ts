import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    // type: 'OAuth2',
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASSWORD,
    // clientId: process.env.SMTP_CLIENT_ID,
    // clientSecret: process.env.SMTP_CLIENT_SECRET,
    // refreshToken: process.env.SMTP_REFRESH_TOKEN,
    // accessToken: process.env.SMTP_ACCESS_TOKEN,
  },
});

export async function sendMail(mailOptions: nodemailer.SendMailOptions){
  try {
    const mail = await transporter.sendMail({
      to: process.env.MAIL_TO_ADDRESSES?.split(', '),
      ...mailOptions,
    });
    console.log('Message sent!', mail.messageId);
  } catch(err){
    console.log(err);
  }
}