/* eslint-disable */

import { useState } from 'react';
import AuthorizationContext from './AuthorizationContext';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { userName: currentUser.username } : null);

  const authorization = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ userName: userData.username });
  };

  const deAuthorization = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthorizationContext.Provider value={{ user, authorization, deAuthorization }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
