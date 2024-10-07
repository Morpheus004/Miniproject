import pkg from 'jsonwebtoken';
import db from "../config/database.js";


const { sign, verify } = pkg;
const KEY='supersecret';

export function createJSONToken(user) {
  return sign({ email: user.email, role: user.role }, KEY, { expiresIn: '1h' });
}

export function createGoogleToken(user) {
  // Log the user object to debug
  console.log('Google user object:', user);
  
  // Check if user object exists
  if (!user) {
      throw new Error('No user data provided');
  }

  // Create token with available user data
  return sign({ 
      email: user.email, 
      role: user.role ,
      googleId: user.id,
      name: user.username
  }, KEY, { expiresIn: '1h' });
}
export default function validateJSONToken(token) {
  return verify(token, KEY);
}