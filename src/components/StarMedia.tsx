import { useState } from 'react';

export const DEFAULT_IMAGE = '/media/default-star.svg';
export const DEFAULT_VIDEO = '/media/default-star.mp4';

export function StarImage({ src, name, className = '', showFallbackLabel = false }: { src: string; name: string; className?: string; showFallbackLabel?: boolean }) {
  const [failed, setFailed] = useState(false);
  const isDefault = !src.trim() || src === DEFAULT_IMAGE || failed;
  return <div className={`star-image ${className}`}>
    <img src={isDefault ? DEFAULT_IMAGE : src} alt={isDefault ? `Изображение по умолчанию для ${name}` : `Иллюстрация звезды ${name}`} loading="lazy" onError={() => { if (!isDefault) setFailed(true); }} />
    {isDefault && showFallbackLabel && <span className="media-label">Изображение по умолчанию</span>}
  </div>;
}

export function StarVideo({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const isDefault = !src.trim() || src === DEFAULT_VIDEO || failed;
  return <div className="video-block">
    <video controls preload="metadata" playsInline src={isDefault ? DEFAULT_VIDEO : src} onError={() => { if (!isDefault) setFailed(true); }}>
      Ваш браузер не поддерживает видео.
    </video>
    <p className="media-caption">{isDefault ? 'Видео по умолчанию · локальный файл проекта' : 'Демонстрационное видео · иллюстрация объекта'}</p>
  </div>;
}
