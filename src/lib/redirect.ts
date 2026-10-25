/** Only allow same-site relative paths, so ?callbackUrl= can't become an open redirect. */
export function safePath(path: string | undefined, fallback = "/profile") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return fallback;
  }
  return path;
}
