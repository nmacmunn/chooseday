/**
 * Listens for the back or forward buttons and invokes callback with the
 * pathname when either is pressed.
 */
export function historyListener(
  callback: (pathName: string) => void
): () => void {
  const listener = () => callback(window.location.pathname);
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
}

/**
 * Add the specified pathName to the browser history as long as it isn't the
 * same as the current url.
 */
export function pushHistory(pathName: string) {
  if (window.location.pathname !== pathName) {
    history.pushState(undefined, "", pathName);
  }
}
