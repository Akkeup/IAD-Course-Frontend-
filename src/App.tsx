import { Provider } from 'react-redux';
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import Button from 'react-bootstrap/Button';
import { BottomNav } from './components/BottomNav';
import { CatalogPage } from './pages/CatalogPage';
import { FeedPage } from './pages/FeedPage';
import { StarPage } from './pages/StarPage';
import { useHashRoute } from './hooks/useHashRoute';
import { DEFAULT_IMAGE } from './components/StarMedia';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { clearForGuest, fetchStars, setFilters } from './store/servicesSlice';
import { LoadingOverlay } from './components/LoadingOverlay';
import { LoginPage } from './pages/LoginPage';
import { AddPage } from './pages/AddPage';
import { http } from './api/http';
import { loggedOut } from './store/authSlice';

export function App() {
  return <Provider store={store}><AppContent /></Provider>;
}

function AppContent() {
  const route = useHashRoute();
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const busy = useAppSelector((state) => state.services.status === 'loading');
  const filters = useAppSelector((state) => state.services.filters);
  const starMatch = /^\/stars\/(\d+)$/.exec(route);
  const isFeed = route === '/feed';

  useEffect(() => { if (route === '/catalog') void dispatch(fetchStars({ authenticated })); }, [dispatch, route, filters.maxDistance, authenticated]);
  useEffect(() => {
    if (route !== '/logout') return;
    void http.post('/auth/logout').catch(() => undefined).finally(() => { dispatch(loggedOut()); dispatch(clearForGuest()); window.location.hash = '#/catalog'; });
  }, [dispatch, route]);

  useEffect(() => {
    const title = route === '/catalog' ? 'Звёзды M31' : route === '/feed' ? 'Лента' : /^\/stars\/\d+$/.test(route) ? 'Карточка звезды' : 'Страница не найдена';
    document.title = `${title} — M31 Galaxy Andromeda`;
  }, [route]);

  const isForm = route === '/add' || route === '/login';
  return <main id="main" className={`app-shell ${isFeed ? 'feed-page' : isForm ? 'form-page page-with-image' : 'grid-page page-with-image'}`}
    style={{ '--page-image': `url('${DEFAULT_IMAGE}')` } as CSSProperties}>
    {!isFeed && <div className="page-shade" aria-hidden="true" />}
    {isFeed ? <FeedPage /> : <section className="page-content">
      {route === '/catalog' ? <CatalogPage filters={filters} onChange={(value) => dispatch(setFilters(value))} />
        : route === '/login' ? <LoginPage />
          : route === '/add' ? <AddPage />
        : starMatch ? <StarPage id={Number(starMatch[1])} />
          : <div className="empty-state"><h1>Страница не найдена</h1><Button href="#/catalog" variant="link">В каталог</Button></div>}
    </section>}
    <LoadingOverlay active={busy} />
    <BottomNav route={route} />
  </main>;
}
