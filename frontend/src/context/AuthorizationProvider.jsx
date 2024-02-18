/* eslint-disable */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorizationContext from './AuthorizationContext';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { userName: currentUser.username } : null);
  const { i18n } = useTranslation();

  const authorization = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ userName: userData.username });
  };

  const deAuthorization = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const [currentModal, setCurrentModal] = useState(null);

  const currentLang = i18n.language;
  localStorage.setItem('currentLanguage', currentLang);

  const getFormattedDate = (date, dayOrTime) => {
    const options = { day: 'numeric', month: 'long' };
    const hours = new Date(date).getHours().toString().padStart(2, '0');
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');

    return dayOrTime === 'day' ? new Date(date).toLocaleDateString(currentLang, options) : `${hours}:${minutes}`;
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
