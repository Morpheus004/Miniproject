import { redirect } from 'react-router-dom';

export function Logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
  return redirect('/login');
}