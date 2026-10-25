/** Builds a sized Unsplash URL from a photo id (e.g. "photo-1527443224154-c4a3942d3acf"). */
export const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
