import '../index.css';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoPerson, GoGlobe } from 'react-icons/go';
import AuthorizationContext from '../context/AuthorizationContext';
import routes from '../utils/routes';

const Navbar = () => {
  const { currentUser, deAuthorization } = useContext(AuthorizationContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language;

  const handleLogOut = () => {
    deAuthorization();
    if (location.pathname === routes.chatsPagePath()) navigate(routes.loginPagePath());
  };

  const currentLangFull = currentLang === 'ru' ? 'Русский' : 'English';
  const langDropdownMenu = currentLang === 'ru' ? 'English' : 'Русский';
  const handleLangSwitch = () => (currentLang === 'ru' ? i18n.changeLanguage('en') : i18n.changeLanguage('ru'));

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container p-0">
        <div className="d-flex align-items-center">
          <a className="navbar-brand me-4" href="/">{t('hexletChat')}</a>
          <div className="dropdown btn-group">
            <button
              type="button"
              className="btn btn-primary rounded-2 px-2"
              style={{ minWidth: '6.2rem', maxHeight: '2.35rem' }}
              data-bs-toggle="dropdown"
            >
              <GoGlobe className="bigIcon me-1" style={{ paddingBottom: '3px', maxWidth: '0.87em' }} />
              <span>{currentLangFull}</span>
              <span className="visually-hidden">{t('languages.langChange')}</span>
            </button>
            <ul className="dropdown-menu p-0" style={{ minWidth: '6.2rem' }}>
              <li>
                <button type="button" className="dropdown-item rounded-1 py-2" onClick={handleLangSwitch}>{langDropdownMenu}</button>
              </li>
            </ul>
          </div>
        </div>
        {!!currentUser && (
          <div className="d-flex align-items-center">
            <GoPerson className="text-light largeIcon me-1" />
            <span className="align-middle text-light m-0 me-4">{currentUser.username}</span>
            <button type="button" className="btn btn-primary" style={{ minWidth: '80px' }} onClick={handleLogOut}>{t('logOut')}</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
