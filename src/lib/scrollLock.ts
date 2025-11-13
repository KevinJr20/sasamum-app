export function lockBodyScroll() {
  try {
    (document.body as any).__prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } catch (e) {
    // ignore (SSR)
  }
}

export function unlockBodyScroll() {
  try {
    document.body.style.overflow = (document.body as any).__prevOverflow || '';
    delete (document.body as any).__prevOverflow;
  } catch (e) {
    // ignore
  }
}

export default { lockBodyScroll, unlockBodyScroll };
