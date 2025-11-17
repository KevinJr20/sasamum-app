// Small navigation helpers to make back behavior testable
export function getBackTarget(screenHistory: string[], fallback = 'dashboard') {
  if (screenHistory && screenHistory.length > 0) {
    return screenHistory[screenHistory.length - 1];
  }
  return fallback;
}

export function popHistory(screenHistory: string[]) {
  if (!screenHistory) return [];
  return screenHistory.slice(0, -1);
}

export default { getBackTarget, popHistory };
