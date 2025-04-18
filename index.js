const express = require('express');
const pool = require('./db');
const { createMailOptions, sendMail } = require('./mailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/users/:id/sendmail', async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mailOptions = createMailOptions(
      user.email,
      'Test Email',
      `Hello ${user.name}, this is a test email from Node.js!`,
      `<h1>Hello ${user.name}!</h1><p>This is a test email from Node.js with <strong>HTML</strong>!</p>`
    );

    const response = await sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', response: response });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
