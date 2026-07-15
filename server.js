require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and serve the public folder
app.use(express.json());
app.use('/esug2026',express.static(path.join(__dirname, 'public')));

// --- EMAIL CONFIGURATION ---
// Replace these with your actual SMTP credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
  // process.env looks up the values loaded by dotenv
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS    }
});

// Endpoint to handle the right-click tagging
app.post('/esug2026/tag', (req, res) => {
    const { x, y, name, email } = req.body;

    const mailOptions = {
        from: 'dvmason@gmail.com',
        to: 'dvmason@gmail.com', // Send to yourself
        subject: 'New Tag: ESUG Photo',
        text: `You have a new person to add to the ESUG photo!\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Designator (Native Image X,Y): ${x}, ${y}\n\n` +
              `Add this object to your frontend 'people' array:\n` +
              `{ x: ${x}, y: ${y}, radius: 30, name: "${name}", email: "${email}" }`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
