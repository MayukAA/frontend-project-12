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

  const [currentModal, setCurrentModal] = useState(null);

  const getFormattedDate = (dayOrTime) => {
    const date = new Date();
    const options = { day: 'numeric', month: 'long' };
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return dayOrTime === 'day' ? date.toLocaleDateString('ru-RU', options) : `${hours}:${minutes}`;
  };

  return (
    <AuthorizationContext.Provider value={{
      currentUser,
      authorization,
      deAuthorization,
      currentModal,
      setCurrentModal,
      getFormattedDate,
    }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
