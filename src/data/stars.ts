import type { Star } from '../types';

// Опубликованные объекты из 0002_seed_andromeda.sql.
// images/*.webp и videos/*.mp4 хранятся в MinIO и не входят в Git.
// Для автономного mock используются оригинальные локальные заглушки репозитория.
export const stars: Star[] = [
  {
    id: 1, name: 'M31-V1', catalog_id: 'M31-V1', distance_kpc: '18.40', velocity_kms: 225,
    status: 'published', likes_count: 2, is_owner: 0, is_liked: 0,
    description: 'Переменная звезда типа цефеиды в галактике Андромеды.',
    image_url: '/media/default-star.svg', video_url: '/media/default-star.mp4',
  },
  {
    id: 2, name: 'M31-1775', catalog_id: 'J004047.84+405602.6', distance_kpc: '18.40', velocity_kms: 225,
    status: 'published', likes_count: 1, is_owner: 0, is_liked: 0,
    description: 'Красный сверхгигант с необычно сильным покраснением спектра.',
    image_url: '/media/default-star.svg', video_url: '/media/default-star.mp4',
  },
  {
    id: 3, name: 'M31-1515', catalog_id: 'J004124.80+411634.7', distance_kpc: '8.70', velocity_kms: 220,
    status: 'published', likes_count: 1, is_owner: 0, is_liked: 0,
    description: 'Красный сверхгигант спектрального класса M3 I.',
    image_url: '/media/default-star.svg', video_url: '/media/default-star.mp4',
  },
  {
    id: 4, name: 'M31-2252', catalog_id: 'J004424.94+412322.3', distance_kpc: '22.60', velocity_kms: 220,
    status: 'published', likes_count: 1, is_owner: 0, is_liked: 0,
    description: 'Яркий красный сверхгигант в диске M31.',
    image_url: '', video_url: '', // Проверка подстановки при пустых полях услуги.
  },
  {
    id: 5, name: 'M31-1372', catalog_id: 'J004454.38+412441.6', distance_kpc: '6.30', velocity_kms: 218,
    status: 'published', likes_count: 0, is_owner: 0, is_liked: 0,
    description: 'Красный сверхгигант из выборки звёзд Андромеды.',
    image_url: '/media/default-star.svg', video_url: '/media/default-star.mp4',
  },
  {
    id: 6, name: 'M31-504', catalog_id: 'J004447.08+412801.7', distance_kpc: '25.00', velocity_kms: 220,
    status: 'published', likes_count: 0, is_owner: 0, is_liked: 0,
    description: 'Красный сверхгигант у внешней границы диска M31.',
    image_url: '/media/default-star.svg', video_url: '/media/default-star.mp4',
  },
];
