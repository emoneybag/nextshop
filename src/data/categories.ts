import type { Category } from "@/types/product";
import { unsplash } from "./unsplash";

/** Presentational metadata for the category tiles and filters. */
export const categories: { name: Category; blurb: string; image: string }[] = [
  { name: "Keyboards", blurb: "Tactile, fast, built to last", image: "/products/keyboard.jpg" },
  { name: "Mice", blurb: "Precision in your palm", image: "/products/mouse.jpg" },
  { name: "Audio", blurb: "Hear every detail", image: "/products/headset.jpg" },
  { name: "Displays", blurb: "Sharper, smoother, bigger", image: unsplash("photo-1527443224154-c4a3942d3acf") },
  { name: "Desk", blurb: "The finishing touches", image: unsplash("photo-1593062096033-9a26b09da705") },
];
