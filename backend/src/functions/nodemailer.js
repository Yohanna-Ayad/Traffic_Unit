const nodemailer = require("nodemailer");
const crypto = require("crypto");


// In-memory storage for verification codes (for demonstration purposes)
const verificationCodes = {};

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // replace with your Gmail address
    pass: process.env.EMAIL_PASSWORD, // replace with your App Password or actual password
  },
});

// Function to send a verification email

function sendVerificationEmail(email, verificationCode) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // replace with your Gmail address
    to: email,
    subject: "Account Verification",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Email</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          .header {
            background-color: #2d3748;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            color: #4a5568;
          }
          .code {
            display: block;
            width: fit-content;
            margin: 20px auto;
            padding: 10px;
            background-color: #edf2f7;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1.25rem;
            text-align: center;
            color: #2d3748;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #a0aec0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Account Verification</h2>
          </div>
          <div class="content">
            <p>Your verification code is:</p>
            <span class="code">${verificationCode}</span>
            <p>The code is only valid for 3 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return "Verification email sent successfully";
  });
}

function sendResetPasswordEmail(email, verificationCode) {
  console.log(verificationCode)
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // replace with your Gmail address
    to: email,
    subject: "Reset Password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          .header {
            background-color: #2d3748;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            color: #4a5568;
          }
          .code {
            display: block;
            width: fit-content;
            margin: 20px auto;
            padding: 10px;
            background-color: #edf2f7;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1.25rem;
            text-align: center;
            color: #2d3748;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #a0aec0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset</h2>
          </div>
          <div class="content">
            <p>Your Reset code is:</p>
            <span class="code">${verificationCode}</span>
            <p>The code is only valid for 1.5 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    callback(null, "Reset password email sent successfully");
  });
}


function sendNotificationUpdate(email) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // replace with your Gmail address
    to: email,
    subject: "Car Update Notification",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Car Update</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          .header {
            background-color: #2d3748;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            color: #4a5568;
          }
          .code {
            display: block;
            width: fit-content;
            margin: 20px auto;
            padding: 10px;
            background-color: #edf2f7;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1.25rem;
            text-align: center;
            color: #2d3748;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #a0aec0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Car Update</h2>
          </div>
          <div class="content">
            <p>Your car has an update available. Please check the app for more details.</p>
            <p>Please Make sure to update your car system to the latest version to enjoy the latest features.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    callback(null, "Notification email sent successfully");
  });
}

// Function to handle user signup
function handleSignup(email) {
  // Generate a random verification code
  const verificationCode = crypto.randomBytes(3).toString("hex"); // Adjust the length of the code as needed

   // Store the verification code and expiration timestamp in memory
   const expirationTime = Date.now() + 3 * 60 * 1000; //  hours in milliseconds
   verificationCodes[email] = { code: verificationCode, expiration: expirationTime };
 
   // Send the verification email
   return sendVerificationEmail(email, verificationCode);
}

// Function to check if the verification code is still available
function isCodeAvailable(email) {
    const storedCode = verificationCodes[email];
  
    if (storedCode && !storedCode.used && Date.now() < storedCode.expiration) {
      // Code is still valid and available
      return true;
    } else {
      // Code is either used, expired, or doesn't exist
      return false;
    }
  }

// Function to handle code verification
function verifyCode(email, code) {
  const storedCode = verificationCodes[email];

  if (storedCode && storedCode.code === code && Date.now() < storedCode.expiration) {
      // Code is correct, perform account activation or other actions as needed
      return true;
  } else {
      // Code is incorrect, expired, or doesn't exist
      return false;
  }
}

function handleForgotPassword(email) {
  // Generate a random verification code
  const verificationCode = crypto.randomBytes(6).toString("hex"); // Adjust the length of the code as needed

  // Store the verification code and expiration timestamp in memory
  const expirationTime = Date.now() + 1.5 * 60 * 1000; // 5 minutes in milliseconds
  verificationCodes[email] = { code: verificationCode, expiration: expirationTime };

  // Send the verification email
  return sendResetPasswordEmail(email, verificationCode);
}



module.exports = {handleSignup, verifyCode, handleForgotPassword, sendNotificationUpdate};
