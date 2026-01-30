/**
 * Root page: redirect based on session. RootRedirect (client) calls getCurrentUser()
 * and redirects to /home or /login. Works with mock (localStorage) or real Supabase.
 */
import RootRedirect from './RootRedirect';

export default function Home() {
  return <RootRedirect />;
}
