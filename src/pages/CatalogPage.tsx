import Button from 'react-bootstrap/Button';
import { StarCard } from '../components/StarCard';
import { StarFilters } from '../components/StarFilters';
import { stars } from '../data/stars';
import { filterStars, initialFilters } from '../lib/filterStars';
import type { Filters } from '../types';

export function CatalogPage({ filters, onChange }: { filters: Filters; onChange: (value: Filters) => void }) {
  const visible = filterStars(stars, filters);
  return <>
    <h1>Звёзды M31</h1>
    <p className="form-note">Гостевой просмотр · mock</p>
    <StarFilters key={filters.maxDistance} value={filters} onChange={onChange} onReset={() => onChange(initialFilters)} />
    <div className="visually-hidden" role="status" aria-live="polite">Найдено: {visible.length} из {stars.length}</div>
    {visible.length > 0 ? <div className="star-grid">{visible.map((star) => <StarCard key={star.id} star={star} />)}</div>
      : <div className="empty-state"><strong>Звёзды не найдены</strong><p>Увеличь допустимое расстояние или сбрось фильтр.</p><Button variant="link" onClick={() => onChange(initialFilters)}>Показать все</Button></div>}
  </>;
}
