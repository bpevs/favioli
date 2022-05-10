import { useEffect, useState } from 'preact/hooks';

export default function useRoute() {
  const [route, setRoute] = useState(location.hash);

  useEffect(() => {
    const updateRoute = () => setRoute(location.hash);
    globalThis.addEventListener('hashchange', updateRoute, false);
    return () => {
      globalThis.removeEventListener('hashchange', updateRoute);
    };
  }, []);

  return route;
}
