import { createContext, useState, useEffect, useCallback } from 'react';
import { setAccessToken, setOnUnauthorized } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout);
  }, [logout]);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setAccessToken(data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        setUser({ id: payload.sub, username: payload.username });
      })
      .catch(() => {
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setAccessToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
