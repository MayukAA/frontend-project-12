import { useContext } from 'react';
import AuthorizationContext from '../context/AuthorizationContext';

const Navbar = () => {
  const { user, deAuthorization } = useContext(AuthorizationContext);

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">Hexlet Chat</a>
        {!!user && <button type="button" className="btn btn-primary" onClick={deAuthorization}>Выйти</button>}
      </div>
    </nav>
  );
};

export default Navbar;
