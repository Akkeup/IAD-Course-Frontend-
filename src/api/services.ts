import { DefaultService } from './generated';
import { OpenAPI } from './generated/core/OpenAPI';
import { stars } from '../data/stars';
import type { Filters, Star } from '../types';

OpenAPI.BASE = '/api';
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = 'include';
const shouldTryBackend = import.meta.env.MODE !== 'test' || import.meta.env.VITE_FORCE_BACKEND === 'true';

export type StarsResponse = { items: Star[]; page: number; has_more: boolean };

function normalizeStar(value: { id: number; name: string; catalog_id: string; distance_kpc: string; velocity_kms: number; status: string; description: string; image_url: string; video_url: string; likes_count: number; is_owner: number; is_liked: number }): Star {
  return {
    ...value,
    image_url: value.image_url.replace(/^https?:\/\/[^/]+:9000/, '/s3'),
    video_url: value.video_url.replace(/^https?:\/\/[^/]+:9000/, '/s3'),
    status: value.status as Star['status'],
    is_owner: value.is_owner ? 1 : 0,
    is_liked: value.is_liked ? 1 : 0,
  };
}

export async function listStars(filters: Filters): Promise<StarsResponse> {
  const distance = filters.maxDistance || undefined;
  try {
    if (!shouldTryBackend) throw new Error('test mock mode');
    const result = await DefaultService.listStars(distance, 1);
    return { ...result, items: result.items.map(normalizeStar) };
  } catch (error) {
    if (filters.authenticated) throw error;
    return {
      items: stars.filter((star) => !distance || Number(star.distance_kpc) <= Number(distance)),
      page: 1,
      has_more: false,
    };
  }
}

export async function getFeed(id?: number, next = false): Promise<Star> {
  try {
    if (!shouldTryBackend) throw new Error('test mock mode');
    return normalizeStar(await DefaultService.getFeed(id, next));
  } catch (error) {
    if (id === undefined) return stars[0];
    const index = stars.findIndex((star) => star.id === id);
    return stars[(index + (next ? 1 : 0) + stars.length) % stars.length];
  }
}

export const api = {
  listStars,
  getFeed,
  getDraft: () => DefaultService.getDraft().then(normalizeStar),
  createStar: (formData: { name: string; image: Blob; video: Blob }) => DefaultService.createStar(formData),
  publishStar: (id: number, body: Parameters<typeof DefaultService.publishStar>[1]) => DefaultService.publishStar(id, body),
  deleteStar: (id: number) => DefaultService.deleteStar(id),
  likeStar: (id: number, value: 0 | 1) => DefaultService.likeStar(id, { value }),
};
