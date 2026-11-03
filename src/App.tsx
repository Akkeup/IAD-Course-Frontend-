import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Button from 'react-bootstrap/Button';
import { BottomNav } from './components/BottomNav';
import { CatalogPage } from './pages/CatalogPage';
import { FeedPage } from './pages/FeedPage';
import { StarPage } from './pages/StarPage';
import { useHashRoute } from './hooks/useHashRoute';
import { initialFilters } from './lib/filterStars';
import { DEFAULT_IMAGE } from './components/StarMedia';

export function App() {
  const route = useHashRoute();
  const [filters, setFilters] = useState(initialFilters);
  const starMatch = /^\/stars\/(\d+)$/.exec(route);
  const isFeed = route === '/feed';

  useEffect(() => {
    const title = route === '/catalog' ? 'Звёзды M31' : route === '/feed' ? 'Лента' : /^\/stars\/\d+$/.test(route) ? 'Карточка звезды' : 'Страница не найдена';
    document.title = `${title} — M31 Galaxy Andromeda`;
  }, [route]);

  return <main id="main" className={`app-shell ${isFeed ? 'feed-page' : 'grid-page page-with-image'}`}
    style={{ '--page-image': `url('${DEFAULT_IMAGE}')` } as CSSProperties}>
    {!isFeed && <div className="page-shade" aria-hidden="true" />}
    {isFeed ? <FeedPage /> : <section className="page-content">
      {route === '/catalog' ? <CatalogPage filters={filters} onChange={setFilters} />
        : starMatch ? <StarPage id={Number(starMatch[1])} />
          : <div className="empty-state"><h1>Страница не найдена</h1><Button href="#/catalog" variant="link">В каталог</Button></div>}
    </section>}
    <BottomNav route={route} />
  </main>;
}
