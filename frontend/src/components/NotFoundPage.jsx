import '../styles.scss';
import 'bootstrap';

const NotFoundPage = () => (
  <div className="h-100 bg-light" id="chat">
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <button type="button" className="btn btn-primary">Выйти</button>
        </div>
      </nav>
      <div className="text-center mt-4">
        <h1 className="h4 text-muted">Страница не найдена</h1>
        <a href="/">Перейти на главную страницу</a>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
