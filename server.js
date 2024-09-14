const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Nodemailer setup (replace with your email config)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shubhamjadhav12401@gmail.com", // Your email
    pass: "Maratha@96", // Your email password
  },
});

// RSVP route
app.post("/rsvp", (req, res) => {
  const { event, email } = req.body;

  // Send RSVP email notification
  const mailOptions = {
    from: "shubhamjadhav12401@gmail.com",
    to: email,
    subject: `RSVP Confirmation for ${event.name}`,
    text: `Thank you for RSVPing to ${event.name} on ${event.date} at ${event.time}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: error.toString() });
    }
    res.status(200).json({ success: true, message: "RSVP sent!" });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
