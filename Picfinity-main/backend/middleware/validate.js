import { z } from 'zod';

const emailSchema = z.string().email('Please provide a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters');

export async function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (!email) {
    return res.status(400).json({ Api_Response: 306, message: 'Email not provided' });
  }
  if (!password) {
    return res.status(400).json({ Api_Response: 307, message: 'Password not provided' });
  }

  try {
    emailSchema.parse(email);
  } catch (err) {
    return res.status(400).json({ Api_Response: 300, message: 'Improper email format' });
  }

  try {
    passwordSchema.parse(password);
  } catch (err) {
    return res.status(400).json({ Api_Response: 301, message: 'Password must be at least 6 characters' });
  }

  next();
}

export async function validateSignup(req, res, next) {
  const { name, email, password } = req.body || {};

  if (!name) {
    return res.status(400).json({ Api_Response: 308, message: 'Name not provided' });
  }
  if (!email) {
    return res.status(400).json({ Api_Response: 306, message: 'Email not provided' });
  }
  if (!password) {
    return res.status(400).json({ Api_Response: 307, message: 'Password not provided' });
  }

  try {
    nameSchema.parse(name);
  } catch (err) {
    return res.status(400).json({ Api_Response: 309, message: err.errors[0]?.message || 'Invalid name' });
  }

  try {
    emailSchema.parse(email);
  } catch (err) {
    return res.status(400).json({ Api_Response: 300, message: 'Improper email format' });
  }

  try {
    passwordSchema.parse(password);
  } catch (err) {
    return res.status(400).json({ Api_Response: 301, message: 'Password must be at least 6 characters' });
  }

  next();
}
