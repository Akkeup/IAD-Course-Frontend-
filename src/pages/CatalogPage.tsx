import Button from 'react-bootstrap/Button';
import { StarCard } from '../components/StarCard';
import { StarFilters } from '../components/StarFilters';
import { initialFilters } from '../lib/filterStars';
import { filterStars } from '../lib/filterStars';
import type { Filters } from '../types';
import { useAppSelector } from '../store/hooks';

export function CatalogPage({ filters, onChange }: { filters: Filters; onChange: (value: Filters) => void }) {
  const items = useAppSelector((state) => state.services.items);
  const visible = filterStars(items, filters);
  const error = useAppSelector((state) => state.services.error);
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return <>
    <h1>Звёзды M31</h1>
    <p className="form-note">{authenticated ? 'Интерфейс пользователя' : 'Гостевой просмотр · API или mock fallback'}</p>
    <StarFilters key={filters.maxDistance} value={filters} onChange={onChange} onReset={() => onChange(initialFilters)} />
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <div className="visually-hidden" role="status" aria-live="polite">Найдено: {visible.length}</div>
    {visible.length > 0 ? <div className="star-grid">{visible.map((star) => <StarCard key={star.id} star={star} />)}</div>
      : <div className="empty-state"><strong>Звёзды не найдены</strong><p>Увеличь допустимое расстояние или сбрось фильтр.</p><Button variant="link" onClick={() => onChange(initialFilters)}>Показать все</Button></div>}
  </>;
}
