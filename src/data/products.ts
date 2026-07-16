import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Gaming Mouse",
    description: "A precise RGB gaming mouse",
    price: 49.99,
    category: "Accessories",
    image: "/products/mouse.jpg",
  },

  {
    id: 2,
    name: "Mechanical Keyboard",
    description: "Mechanical switches with RGB lighting",
    price: 99.99,
    category: "Keyboards",
    image: "/products/keyboard.jpg",
  },

  {
    id: 3,
    name: "Gaming Headset",
    description: "Surround sound gaming headset",
    price: 79.99,
    category: "Audio",
    image: "/products/headset.jpg",
  },
];