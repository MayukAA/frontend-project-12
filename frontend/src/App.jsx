import './styles.scss';
import './index.css';
import 'bootstrap';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppProvider from './context/AppProvider';
import Navbar from './components/Navbar';
import ChatsPage from './pages/ChatsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import routes from './utils/routes';

const IsAuthorization = () => {
  const currentUser = localStorage.getItem('user');

  return currentUser ? <ChatsPage /> : <Navigate to={routes.loginPagePath()} />;
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={routes.chatsPagePath()} element={<IsAuthorization />} />
        <Route path={routes.loginPagePath()} element={<LoginPage />} />
        <Route path={routes.signupPagePath()} element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </BrowserRouter>
  </AppProvider>
);

export default App;
