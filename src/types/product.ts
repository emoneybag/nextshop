export type Category = "Keyboards" | "Mice" | "Audio" | "Displays" | "Desk";

export type Product = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: number;
  /** Original price, when the item is on sale. */
  compareAt?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  badge?: "New" | "Sale" | "Best seller";
  features: string[];
  specs: { label: string; value: string }[];
};
