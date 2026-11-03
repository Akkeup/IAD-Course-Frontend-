import Button from 'react-bootstrap/Button';
import { stars } from '../data/stars';
import { StarImage, StarVideo } from '../components/StarMedia';

export function StarPage({ id }: { id: number }) {
  const star = stars.find((item) => item.id === id);
  if (!star) return <div className="empty-state"><h1>Звезда не найдена</h1><p>Проверьте ссылку на объект.</p><Button href="#/catalog" variant="link">Вернуться в каталог</Button></div>;

  return <article className="detail-page">
    <a className="back-link form-note" href="#/catalog">← К звёздному каталогу</a>
    <h1>{star.name}</h1>
    <p className="catalog-id detail-id">{star.catalog_id}</p>
    <StarImage key={star.id} src={star.image_url} name={star.name} className="detail-image" showFallbackLabel />
    <div className="metrics">
      <div className="metric"><span>R =</span><strong>{Number(star.distance_kpc).toFixed(1)} кпк</strong></div>
      <div className="metric"><span>v ≈</span><strong>{star.velocity_kms} км/с</strong></div>
    </div>
    <section className="detail-description"><h2>Краткая информация</h2><p>{star.description}</p></section>
    <p className="form-note">Опубликовано · {star.likes_count} отметок нравится</p>
    <section className="detail-video"><h2>Видео</h2><StarVideo key={star.id} src={star.video_url} /></section>
  </article>;
}
