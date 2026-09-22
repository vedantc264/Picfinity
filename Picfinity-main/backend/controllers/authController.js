import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import getPool from '../config/db.js';

dotenv.config();
const SECRET = process.env.JWT_SECRET || process.env.SECRETS || 'picfinity_secret_key_2026';
const saltRounds = 10;

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const pool = getPool();

    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ Api_Response: 302, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase().trim(), hashedPassword]
    );

    const userId = result.insertId;
    const token = jwt.sign({ user_id: userId }, SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      user_id: userId,
      token,
      user: {
        user_id: userId,
        name,
        email: email.toLowerCase().trim()
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('[AuthController.signup]', error);
    return res.status(500).json({ Api_Response: 304, message: 'Error in signup backend' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const pool = getPool();

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(404).json({ Api_Response: 302, message: 'Email not found' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ Api_Response: 303, message: 'Incorrect password' });
    }

    const token = jwt.sign({ user_id: user.id }, SECRET, { expiresIn: '7d' });

    return res.json({
      user_id: user.id,
      token,
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profile_image
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('[AuthController.login]', error);
    return res.status(500).json({ Api_Response: 304, message: 'Error in login backend' });
  }
}

export async function me(req, res) {
  try {
    const userId = parseInt(req.user_id, 10);
    const pool = getPool();

    const [users] = await pool.query('SELECT id, name, email, profile_image FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ Api_Response: 310, message: 'No such user' });
    }

    const user = users[0];
    return res.json({
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profile_image || ''
      }
    });
  } catch (error) {
    console.error('[AuthController.me]', error);
    return res.status(500).json({ message: 'Error fetching user' });
  }
}

function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ Api_Response: 306, message: 'Email not provided' });
    }

    const pool = getPool();
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(404).json({ Api_Response: 302, message: 'User not found' });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?', [
      otp,
      expiry,
      email.toLowerCase().trim()
    ]);

    // Optional email sending
    if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST || 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: 'Picfinity - Your Password Reset OTP',
        text: `Your OTP to reset password is: ${otp}. It is valid for 10 minutes.`
      });
    } else {
      console.log(`[DEV OTP] For ${email}: ${otp}`);
    }

    return res.json({ message: 'OTP sent to your email successfully' });
  } catch (error) {
    console.error('[AuthController.forgotPassword]', error);
    return res.status(500).json({ message: 'Error processing forgot password request' });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const pool = getPool();
    const [users] = await pool.query('SELECT id, otp, otp_expiry FROM users WHERE email = ?', [
      email.toLowerCase().trim()
    ]);

    if (users.length === 0) {
      return res.status(404).json({ Api_Response: 312, message: 'User not found' });
    }

    const user = users[0];
    if (user.otp === otp && new Date(user.otp_expiry) > new Date()) {
      return res.json({ verified: true, message: 'OTP verified successfully' });
    }

    return res.status(400).json({ Api_Response: 314, message: 'Invalid or expired OTP' });
  } catch (error) {
    console.error('[AuthController.verifyOtp]', error);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const pool = getPool();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?',
      [hashedPassword, email.toLowerCase().trim()]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('[AuthController.changePassword]', error);
    return res.status(500).json({ message: 'Error updating password' });
  }
}
