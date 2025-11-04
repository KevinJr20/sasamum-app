import { useEffect } from 'react';

export function useScrollToTop() {
  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
}
