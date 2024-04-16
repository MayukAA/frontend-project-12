import ReactDOM from 'react-dom/client';
import Init from './Init';

const application = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await Init());
};

application();
