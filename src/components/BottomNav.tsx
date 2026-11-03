import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function BottomNav({ route }: { route: string }) {
  return <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
    <Nav.Link className={`nav-item ${route === '/feed' ? 'nav-item--active' : ''}`} href="#/feed" aria-current={route === '/feed' ? 'page' : undefined}>
      <span className="nav-icon" aria-hidden="true">●</span><span>Лента</span>
    </Nav.Link>
    <Nav.Link className="nav-item" disabled title="Добавление недоступно гостю">
      <span className="nav-icon" aria-hidden="true">＋</span><span>Добавление</span>
    </Nav.Link>
    <Nav.Link className={`nav-item ${route === '/catalog' || route.startsWith('/stars/') ? 'nav-item--active' : ''}`} href="#/catalog" aria-current={route === '/catalog' ? 'page' : undefined}>
      <span className="nav-icon" aria-hidden="true">▦</span><span>Плитка</span>
    </Nav.Link>
    <Nav.Link className="nav-item" disabled title="Вход недоступен в mock-версии">
      <span className="nav-icon" aria-hidden="true">↪</span><span>Вход</span>
    </Nav.Link>
  </Navbar>;
}
