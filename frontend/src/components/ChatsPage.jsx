import '../styles.scss';
import 'bootstrap';

const ChatsPage = () => (
  <div className="h-100 bg-light" id="chat">
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <button type="button" className="btn btn-primary">Выйти</button>
        </div>
      </nav>
      <div className="p-2">Здесь будут чаты</div>
    </div>
  </div>
);

export default ChatsPage;
