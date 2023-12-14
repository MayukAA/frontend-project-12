/* eslint-disable */

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import AuthorizationProvider from './context/AuthorizationProvider';
import ChatsPage from './components/ChatsPage';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './components/LoginPage';
import routes from './routes';

const IsAuthorization = () => {
  const currentUser = JSON.parse(localStorage.getItem('user')); // нужен ли тут парсинг? Потестить, в общем;
  console.log(currentUser);

  return currentUser ? <ChatsPage /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <AuthorizationProvider>
    <BrowserRouter>
      <Routes>
        <Route path={routes.chatsPagePath()} element={<IsAuthorization />} />
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthorizationProvider>
);

export default App;
