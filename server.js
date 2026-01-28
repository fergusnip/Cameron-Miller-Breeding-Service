import express from "express";
import path from "path";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security / parsing
app.use(express.json({ limit: "50kb" }));

// Serve the static site
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// Contact endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please include name, email, and message." });
    }

    // Configure SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,      // e.g. darcybe22@gmail.com
        pass: process.env.GMAIL_APP_PASS,  // Gmail App Password (NOT your normal password)
      },
    });

    const subject = `New enquiry — Cameron Miller Breeding Services (from ${name})`;

    const text = [
      "New contact form submission:",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Mobile: ${phone || "(not provided)"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: `"Website Enquiry" <${process.env.GMAIL_USER}>`,
      to: "darcybe22@gmail.com",
      replyTo: email,
      subject,
      text,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error sending email." });
  }
});

// Fallback: serve index.html for the root
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
