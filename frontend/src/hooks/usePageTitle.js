import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - Lens+GitHub` : 'Lens+GitHub - Repository Search';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
