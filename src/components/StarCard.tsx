import type { Star } from '../types';
import { StarImage } from './StarMedia';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteStar, toggleLike } from '../store/servicesSlice';

export function StarCard({ star }: { star: Star }) {
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  function like() {
    if (!authenticated) { window.location.hash = '#/login'; return; }
    void dispatch(toggleLike({ id: star.id, liked: Boolean(star.is_liked) }));
  }
  return <article className="star-card">
    <StarImage src={star.image_url} name={star.name} />
    <span className="star-card__shade" aria-hidden="true" />
    <a className="star-card__link" href={`#/stars/${star.id}`} aria-label={`Открыть ${star.name}`} />
    {authenticated && Boolean(star.is_owner) && <button className="action-button action-button--icon star-card__delete" type="button" onClick={() => void dispatch(deleteStar(star.id))} aria-label={`Удалить ${star.name}`}>×</button>}
    <div className="star-card__body">
      <p className="star-card__distance">R = {Number(star.distance_kpc).toFixed(1)} кпк</p>
      <h2>{star.name}</h2>
      <div className="star-card__actions">
        <button className={`action-button action-button--like ${star.is_liked ? 'action-button--liked' : ''}`} type="button" onClick={like} aria-label={`${star.is_liked ? 'Убрать лайк' : 'Поставить лайк'}: ${star.name}`}>
          <span aria-hidden="true">{star.is_liked ? '♥' : '♡'}</span>{star.likes_count}
        </button>
      </div>
    </div>
  </article>;
}
