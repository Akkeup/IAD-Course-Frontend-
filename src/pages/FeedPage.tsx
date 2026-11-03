import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { stars } from '../data/stars';
import { StarImage } from '../components/StarMedia';

export function FeedPage() {
  const [index, setIndex] = useState(0);
  const star = stars[index];

  return <>
    <StarImage key={star.id} src={star.image_url} name={star.name} className="feed-media" />
    <div className="feed-shade" aria-hidden="true" />
    <header className="feed-header"><p className="eyebrow">M31</p><h1>Galaxy Andromeda</h1></header>
    <aside className="feed-aside" aria-label="Параметры звезды">
      <div className="like-orbit" role="img" aria-label={`${star.likes_count} отметок нравится`}>
        <span aria-hidden="true">♥</span><small>{star.likes_count}</small>
      </div>
      <div className="metrics">
        <div className="metric"><span>R =</span><strong>{Number(star.distance_kpc).toFixed(1)} кпк</strong></div>
        <div className="metric"><span>v ≈</span><strong>{star.velocity_kms} км/с</strong></div>
      </div>
      <Button className="next-button" variant="light" aria-label="Открыть следующую звезду" onClick={() => setIndex((index + 1) % stars.length)}>Дальше <span aria-hidden="true">→</span></Button>
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
