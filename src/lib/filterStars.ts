import type { Filters, Star } from '../types';

export const initialFilters: Filters = { maxDistance: '' };

export function filterStars(items: Star[], filters: Filters): Star[] {
  return items.filter((star) => filters.maxDistance === ''
    || Number(star.distance_kpc) <= Number(filters.maxDistance));
}
