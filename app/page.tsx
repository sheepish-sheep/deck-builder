import { redirect } from 'next/navigation';

// Implement: check session (e.g. getCurrentUser()); if logged in redirect to /home, else to /login
export default function Home() {
  redirect('/login');
}
