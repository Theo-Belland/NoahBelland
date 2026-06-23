require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

const EMAIL_TO = process.env.EMAIL_TO || process.env.MAIL_PRO || process.env.MAIL_PERSO;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.MAIL_PRO || process.env.MAIL_PERSO;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { nom, email, objet, message } = req.body;

  if (!nom || !email || !objet || !message) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis.'
    });
  }

  if (!EMAIL_TO || !EMAIL_FROM || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({
      success: false,
      message: 'La configuration SMTP n’est pas complète.'
    });
  }

  ensureDataFile();

  const entry = {
    nom,
    email,
    objet,
    message,
    date: new Date().toISOString()
  };

  const messages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  messages.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `Nouveau message : ${objet}`,
      text: `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`
    });

    return res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès.'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l’envoi du message.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
