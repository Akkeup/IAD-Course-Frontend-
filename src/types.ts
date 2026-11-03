// Основные поля совпадают с ApiStar соседнего учебного бэкенда.
export interface Star {
  id: number;
  name: string;
  catalog_id: string;
  distance_kpc: string;
  velocity_kms: number;
  status: 'published';
  description: string;
  image_url: string;
  video_url: string;
  likes_count: number;
  is_owner: 0 | 1;
  is_liked: 0 | 1;
}

export interface Filters {
  maxDistance: string;
}
