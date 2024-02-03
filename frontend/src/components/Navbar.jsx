import '../index.css';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoPerson } from 'react-icons/go';
import AuthorizationContext from '../context/AuthorizationContext';
import routes from '../utils/routes';

const Navbar = () => {
  const { currentUser, deAuthorization } = useContext(AuthorizationContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    deAuthorization();
    if (location.pathname === routes.chatsPagePath()) navigate(routes.loginPagePath());
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        {!!currentUser && (
          <div className="d-flex align-items-center">
            <GoPerson className="text-light largeIcon me-1" />
            <span className="text-light m-0 me-4">{currentUser.username}</span>
            <button type="button" className="btn btn-primary" onClick={handleClick}>Выйти</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
