import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SignupForm from '../components/Auth/SignupForm';

export default function Signup() {
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <div>
      <SignupForm />
      <p className="auth-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
