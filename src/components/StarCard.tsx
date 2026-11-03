import Card from 'react-bootstrap/Card';
import type { Star } from '../types';
import { StarImage } from './StarMedia';

export function StarCard({ star }: { star: Star }) {
  return <Card as="article" className="star-card">
    <StarImage src={star.image_url} name={star.name} />
    <span className="star-card__shade" aria-hidden="true" />
    <a className="star-card__link" href={`#/stars/${star.id}`} aria-label={`Открыть ${star.name}`} />
    <div className="star-card__body">
      <p className="star-card__distance">R = {Number(star.distance_kpc).toFixed(1)} кпк</p>
      <h2>{star.name}</h2>
      <span className="star-card__likes">{star.likes_count} <span aria-hidden="true">♥</span></span>
    </div>
  </Card>;
}
