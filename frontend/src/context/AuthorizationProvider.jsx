/* eslint-disable */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorizationContext from './AuthorizationContext';

const AuthorizationProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { userName: currentUser.username } : null);
  const [currentModal, setCurrentModal] = useState(null);
  const [btnDisabledNetworkWait, setBtnDisabledNetworkWait] = useState(false);
  const { i18n } = useTranslation();

  const authorization = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ userName: userData.username });
  };

  const deAuthorization = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const currentLang = i18n.language;
  localStorage.setItem('currentLanguage', currentLang);

  const getFormattedDate = (date, dayOrTime) => {
    const dayOptions = { day: 'numeric', month: 'long' };
    const timeOptions = currentLang === 'ru'
      ? { hour: 'numeric', minute: 'numeric' }
      : { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDay = new Date(date).toLocaleDateString(currentLang, dayOptions);
    const formattedTime = new Date(date).toLocaleString([], timeOptions);

    return dayOrTime === 'day' ? formattedDay : formattedTime;
  };

  return (
    <AuthorizationContext.Provider value={{
      currentUser,
      currentModal,
      setCurrentModal,
      btnDisabledNetworkWait,
      setBtnDisabledNetworkWait,
      authorization,
      deAuthorization,
      getFormattedDate,
    }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
