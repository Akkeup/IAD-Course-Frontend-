import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAppSelector } from '../store/hooks';

export function BottomNav({ route }: { route: string }) {
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <Navbar as="nav" className="bottom-nav" aria-label="Основная навигация">
    <Nav.Link className={`nav-item ${route === '/feed' ? 'nav-item--active' : ''}`} href="#/feed" aria-current={route === '/feed' ? 'page' : undefined}>
      <span className="nav-icon" aria-hidden="true">●</span><span>Лента</span>
    </Nav.Link>
    <Nav.Link className={`nav-item ${route === '/add' ? 'nav-item--active' : ''}`} href={authenticated ? '#/add' : '#/login'}>
      <span className="nav-icon" aria-hidden="true">＋</span><span>Добавление</span>
    </Nav.Link>
    <Nav.Link className={`nav-item ${route === '/catalog' || route.startsWith('/stars/') ? 'nav-item--active' : ''}`} href="#/catalog" aria-current={route === '/catalog' ? 'page' : undefined}>
      <span className="nav-icon" aria-hidden="true">▦</span><span>Плитка</span>
    </Nav.Link>
    <Nav.Link className={`nav-item ${route === '/login' ? 'nav-item--active' : ''}`} href={authenticated ? '#/logout' : '#/login'}>
      <span className="nav-icon" aria-hidden="true">{authenticated ? '↩' : '↪'}</span><span>{authenticated ? 'Выход' : 'Вход'}</span>
    </Nav.Link>
  </Navbar>;
}
