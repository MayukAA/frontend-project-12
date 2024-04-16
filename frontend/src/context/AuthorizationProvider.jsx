import { useState, useMemo } from 'react';
import { AuthorizationContext } from './index';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  // eslint-disable-next-line
  const [user, setUser] = useState(currentUser ? { userName: currentUser.username } : null);

  const authorization = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ userName: userData.username });
  };

  const deAuthorization = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const authUtils = useMemo(() => ({
    currentUser,
    authorization,
    deAuthorization,
  }), [currentUser, authorization, deAuthorization]);

  return (
    <AuthorizationContext.Provider value={authUtils}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
