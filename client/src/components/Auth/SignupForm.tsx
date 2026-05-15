import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../api/client';
import './Auth.css';

export default function SignupForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch<{ user: { id: number; username: string }; accessToken: string; refreshToken: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      login(data.user, data.accessToken, data.refreshToken);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p className="auth-error">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
