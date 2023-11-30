import React, { useContext, createContext, useState } from 'react';
import axios from 'axios';
const authContext = createContext();

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

function useProvideAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const signin = (newToken, cb) => {
    setToken(newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    localStorage.setItem('token', newToken);
    cb();
  };

  const signout = (cb) => {
    setToken(null);
    cb();
  };

  return {
    token,
    signin,
    signout,
  };
}

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);

export default ProvideAuth;
