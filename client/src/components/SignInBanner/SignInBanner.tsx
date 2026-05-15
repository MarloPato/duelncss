import { Link } from 'react-router-dom';
import './SignInBanner.css';

export default function SignInBanner() {
  return (
    <div className="signin-banner">
      <Link to="/login">Sign in</Link> to save your score
    </div>
  );
}
