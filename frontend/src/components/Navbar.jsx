import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthorizationContext from '../context/AuthorizationContext';
import routes from '../utils/routes';

const Navbar = () => {
  const { user, deAuthorization } = useContext(AuthorizationContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    deAuthorization();

    if (location.pathname === routes.chatsPagePath()) {
      navigate(routes.loginPagePath());
    }
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        {!!user && <button type="button" className="btn btn-primary" onClick={handleClick}>Выйти</button>}
      </div>
    </nav>
  );
};

export default Navbar;
