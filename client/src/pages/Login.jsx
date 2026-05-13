import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';

export default function Login() {
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <div>
      <LoginForm />
      <p className="auth-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
