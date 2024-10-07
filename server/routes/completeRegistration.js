import express from 'express';
import db from "../config/database.js";
import { createGoogleToken } from '../util/auth.js';

const router = express.Router();

router.patch('/', async (req, res) => {
  const { role,email } = req.body;

  try {
    // Insert into users table
    const newUser = await db.query(
      'UPDATE users SET role= $1 WHERE email= $2 RETURNING *',
      [role,email]
    );

    const uid = newUser.rows[0].uid;

    // Insert into appropriate role table
    if (role === 'student') {
      await db.query(
        'INSERT INTO student (uid) VALUES ($1)',
        [uid]
      );
    } else if (role === 'alumni') {
      await db.query(
        'INSERT INTO alumnus (uid) VALUES ($1)',
        [uid]
      );
    }
    // Create JWT token
    const token = await createGoogleToken(newUser.rows[0]);
    res.json({ token });

  } catch (error) {
    // If there's an error, roll back the transaction
    await db.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;