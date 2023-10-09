const nodemailer = require('nodemailer');

// Function to send an email
exports.sendEmail = async (toEmail, subject, message) => {
  // Create a transporter using your email service provider's SMTP settings
  const transporter = nodemailer.createTransport({
    host: "mail.myssticbyarzoo.com",
      port: 465,
      secure: true,
    auth: {
      user: process.env.SERVEREMAILID, // Your email address
      pass: process.env.SERVEREMAILPASSWORD // Your email password or an app-specific password
    }
  });

  // Define the email options
//   console.log(toEmail, subject, message)
  const mailOptions = {
    from: `MyssticByArzoo <support@myssticbyarzoo.com>`, // Sender's email address
    to: toEmail, // Recipient's email address
    subject: subject, // Email subject
    html: message // Email body
  };

  try {
    // Use the transporter to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

