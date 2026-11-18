import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { stars } from '../data/stars';
import { StarImage } from '../components/StarMedia';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeed, toggleLike } from '../store/servicesSlice';

export function FeedPage() {
  const [index, setIndex] = useState(0);
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.services.current);
  const requestStatus = useAppSelector((state) => state.services.status);
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const star = requestStatus === 'succeeded' && current ? current : stars[index];
  useEffect(() => { void dispatch(fetchFeed({})); }, [dispatch]);

  return <>
    <StarImage key={star.id} src={star.image_url} name={star.name} className="feed-media" />
    <div className="feed-shade" aria-hidden="true" />
    <header className="feed-header"><p className="eyebrow">M31</p><h1>Galaxy Andromeda</h1></header>
    <aside className="feed-aside" aria-label="Параметры звезды">
      <button className={`like-orbit ${star.is_liked ? 'like-orbit--liked' : ''}`} type="button" aria-label={`${star.is_liked ? 'Убрать лайк' : 'Поставить лайк'}: ${star.likes_count}`} onClick={() => {
        if (!authenticated) { window.location.hash = '#/login'; return; }
        void dispatch(toggleLike({ id: star.id, liked: Boolean(star.is_liked) }));
      }}>
        <span aria-hidden="true">♥</span><small>{star.likes_count}</small>
      </button>
      <div className="metrics">
        <div className="metric"><span>R =</span><strong>{Number(star.distance_kpc).toFixed(1)} кпк</strong></div>
        <div className="metric"><span>v ≈</span><strong>{star.velocity_kms} км/с</strong></div>
      </div>
      <Button className="next-button" variant="light" aria-label="Открыть следующую звезду" onClick={() => { setIndex((index + 1) % stars.length); void dispatch(fetchFeed({ id: star.id, next: true })); }}>Дальше <span aria-hidden="true">→</span></Button>
    </aside>
    <section className="feed-content" aria-labelledby="star-title" aria-live="polite">
      <h2 id="star-title"><a href={`#/stars/${star.id}`}>{star.name}</a></h2>
      <p className="catalog-id">{star.catalog_id}</p>
      <div className="description" key={star.id}>
        <input className="description-checkbox" id={`description-toggle-${star.id}`} type="checkbox" aria-label="Развернуть описание" />
        <p>{star.description}</p>
        <label className="description-toggle description-toggle--closed" htmlFor={`description-toggle-${star.id}`}>ещё</label>
        <label className="description-toggle description-toggle--open" htmlFor={`description-toggle-${star.id}`}>свернуть</label>
      </div>
    </section>
  </>;
}
