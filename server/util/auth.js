import pkg from 'jsonwebtoken';


const { sign, verify } = pkg;
const KEY='supersecret';

export function createJSONToken(user) {
    return sign({ email:user.email , role:user.role }, KEY, { expiresIn: '1h' });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}