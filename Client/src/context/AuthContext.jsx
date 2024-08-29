import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ username: '', token: '', score: 0 });

  // Retrieve authentication state from localStorage on app initialization
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    if (auth.username) {
      localStorage.setItem('auth', JSON.stringify(auth));
    }
  }, [auth]);

  const logout = () => {
    setAuth({ username: '', token: '', score: 0 });
    localStorage.removeItem('auth'); // Clear storage on logout
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
