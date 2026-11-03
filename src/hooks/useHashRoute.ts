import { useEffect, useState } from 'react';

function readRoute() {
  return window.location.hash.slice(1) || '/catalog';
}

// Простая SPA-навигация без роутера и Context, с поддержкой Назад/Вперёд.
export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}
