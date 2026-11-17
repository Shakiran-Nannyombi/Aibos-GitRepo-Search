import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} · Lens+Github` : 'Lens+Github · Repository search';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
