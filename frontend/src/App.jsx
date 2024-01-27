/* eslint-disable */

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import AuthorizationProvider from './context/AuthorizationProvider';
import Navbar from './components/Navbar';
import ChatsPage from './components/ChatsPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import routes from './utils/routes';

const IsAuthorization = () => {
  const currentUser = localStorage.getItem('user');

  return currentUser ? <ChatsPage /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <AuthorizationProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={routes.chatsPagePath()} element={<IsAuthorization />} />
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthorizationProvider>
);

export default App;
