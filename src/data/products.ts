import type { Product } from "@/types/product";
import { unsplash } from "./unsplash";

/**
 * Seed data for the catalogue. The live catalogue is stored in Postgres: edit
 * this file and run `npm run db:seed` to insert or update products.
 * Photos 1–3 are local assets; the rest are Unsplash stock photos
 * (`npm run check:images` verifies the URLs).
 */
export const seedProducts: Product[] = [
  {
    id: 1,
    name: "Apex Wireless Gaming Mouse",
    tagline: "58g of pure precision",
    description:
      "A featherweight wireless mouse with a 26K DPI optical sensor, hot-swappable switches and a battery that lasts a full week of heavy play.",
    price: 49.99,
    category: "Mice",
    image: "/products/mouse.jpg",
    rating: 4.7,
    reviews: 312,
    badge: "Best seller",
    features: ["26,000 DPI optical sensor", "Up to 70 hours of battery", "1000 Hz wireless polling", "RGB with onboard profiles"],
    specs: [
      { label: "Weight", value: "58 g" },
      { label: "Connection", value: "2.4 GHz / Bluetooth / USB-C" },
      { label: "Buttons", value: "6 programmable" },
    ],
  },
  {
    id: 2,
    name: "Forge 60% Mechanical Keyboard",
    tagline: "Compact, clicky, customisable",
    description:
      "A hot-swappable 60% mechanical keyboard with per-key RGB, gasket-mounted plate and PBT keycaps that never go shiny.",
    price: 99.99,
    category: "Keyboards",
    image: "/products/keyboard.jpg",
    rating: 4.8,
    reviews: 528,
    badge: "Best seller",
    features: ["Hot-swappable switches", "Per-key RGB lighting", "Double-shot PBT keycaps", "Detachable USB-C cable"],
    specs: [
      { label: "Layout", value: "60% / 61 keys" },
      { label: "Switches", value: "Linear red (pre-lubed)" },
      { label: "Polling rate", value: "1000 Hz" },
    ],
  },
  {
    id: 3,
    name: "Pulse Surround Headset",
    tagline: "Immersive 7.1 sound, all-day comfort",
    description:
      "Over-ear gaming headset with 50 mm drivers, virtual 7.1 surround and a detachable noise-cancelling boom mic. Memory-foam cushions keep long sessions comfortable.",
    price: 79.99,
    compareAt: 99.99,
    category: "Audio",
    image: "/products/headset.jpg",
    rating: 4.5,
    reviews: 204,
    badge: "Sale",
    features: ["50 mm neodymium drivers", "Virtual 7.1 surround", "Detachable noise-cancelling mic", "Memory-foam ear cushions"],
    specs: [
      { label: "Frequency", value: "20 Hz – 20 kHz" },
      { label: "Connection", value: "USB-C / 3.5 mm" },
      { label: "Weight", value: "310 g" },
    ],
  },
  {
    id: 4,
    name: "Lumen 27\" QHD Gaming Monitor",
    tagline: "165 Hz, 1 ms, zero compromises",
    description:
      "A 27-inch 2560×1440 IPS panel with a 165 Hz refresh rate, 1 ms response and near-complete sRGB coverage. Variable refresh rate keeps motion buttery.",
    price: 329,
    compareAt: 379,
    category: "Displays",
    image: unsplash("photo-1527443224154-c4a3942d3acf"),
    rating: 4.6,
    reviews: 143,
    badge: "Sale",
    features: ["2560×1440 IPS panel", "165 Hz / 1 ms response", "Adaptive-sync compatible", "Height & tilt adjustable stand"],
    specs: [
      { label: "Size", value: "27 inch" },
      { label: "Inputs", value: "2× HDMI 2.1, DisplayPort 1.4" },
      { label: "Colour", value: "99% sRGB" },
    ],
  },
  {
    id: 5,
    name: "Nova 75% Low-Profile Keyboard",
    tagline: "Slim, silent, wireless",
    description:
      "A low-profile 75% wireless keyboard that pairs with three devices at once. Quiet tactile switches make it perfect for shared spaces.",
    price: 119,
    category: "Keyboards",
    image: unsplash("photo-1587829741301-dc798b83add3"),
    rating: 4.4,
    reviews: 87,
    badge: "New",
    features: ["Pairs with 3 devices", "Low-profile tactile switches", "4-month battery life", "Aluminium top case"],
    specs: [
      { label: "Layout", value: "75% / 84 keys" },
      { label: "Connection", value: "Bluetooth 5.1 / USB-C" },
      { label: "Battery", value: "4000 mAh" },
    ],
  },
  {
    id: 6,
    name: "Drift Ultralight Mouse",
    tagline: "Honeycomb shell, 49 grams",
    description:
      "An ultralight wired mouse with a perforated shell and flexible paracord cable. Built for fast, flick-heavy shooters.",
    price: 69.99,
    category: "Mice",
    image: unsplash("photo-1527864550417-7fd91fc51a46"),
    rating: 4.6,
    reviews: 176,
    features: ["49 g honeycomb shell", "Paracord-style cable", "PTFE glide feet", "Optical switches"],
    specs: [
      { label: "Weight", value: "49 g" },
      { label: "Sensor", value: "20K DPI optical" },
      { label: "Connection", value: "USB-C (wired)" },
    ],
  },
  {
    id: 7,
    name: "Echo Studio USB Microphone",
    tagline: "Broadcast clarity, plug and play",
    description:
      "A cardioid condenser USB microphone with a built-in pop filter, gain dial and zero-latency monitoring. Stream, record or call like a pro.",
    price: 89.99,
    category: "Audio",
    image: unsplash("photo-1590602847861-f357a9332bbc"),
    rating: 4.7,
    reviews: 259,
    badge: "Best seller",
    features: ["Cardioid condenser capsule", "Zero-latency monitoring", "One-touch mute", "Includes desk stand"],
    specs: [
      { label: "Sample rate", value: "24-bit / 96 kHz" },
      { label: "Pattern", value: "Cardioid" },
      { label: "Connection", value: "USB-C" },
    ],
  },
  {
    id: 8,
    name: "Tempo Bluetooth Speaker",
    tagline: "Room-filling sound, pocket-friendly",
    description:
      "A compact Bluetooth speaker with surprisingly deep bass, IPX5 water resistance and 18 hours of playtime.",
    price: 59,
    category: "Audio",
    image: unsplash("photo-1608043152269-423dbba4e7e1"),
    rating: 4.3,
    reviews: 98,
    features: ["18-hour playtime", "IPX5 water resistant", "Dual-speaker pairing", "USB-C fast charge"],
    specs: [
      { label: "Output", value: "20 W" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Weight", value: "540 g" },
    ],
  },
  {
    id: 9,
    name: "Slate XL Desk Mat",
    tagline: "Your whole setup, one surface",
    description:
      "A 900×400 mm stitched-edge desk mat with a smooth micro-weave surface and a non-slip rubber base. Fits keyboard and mouse with room to spare.",
    price: 24.99,
    category: "Desk",
    image: unsplash("photo-1616588589676-62b3bd4ff6d2"),
    rating: 4.8,
    reviews: 641,
    features: ["900 × 400 mm", "Stitched anti-fray edges", "Water-resistant surface", "Non-slip rubber base"],
    specs: [
      { label: "Size", value: "900 × 400 × 3 mm" },
      { label: "Surface", value: "Micro-weave cloth" },
      { label: "Base", value: "Natural rubber" },
    ],
  },
  {
    id: 10,
    name: "Halo Monitor Light Bar",
    tagline: "Glare-free light for late sessions",
    description:
      "An asymmetric light bar that clips to your monitor, lighting your desk without reflecting on the screen. Adjustable brightness and colour temperature.",
    price: 39.99,
    category: "Desk",
    image: unsplash("photo-1593642632559-0c6d3fc62b89"),
    rating: 4.5,
    reviews: 118,
    badge: "New",
    features: ["Asymmetric glare-free optics", "2700–6500 K adjustable", "Touch controls", "USB powered"],
    specs: [
      { label: "Brightness", value: "Up to 600 lux" },
      { label: "Length", value: "45 cm" },
      { label: "Power", value: "USB-A, 5 W" },
    ],
  },
  {
    id: 11,
    name: "Stack Aluminium Laptop Stand",
    tagline: "Eye-level screen, cooler laptop",
    description:
      "A foldable CNC-aluminium stand that raises your laptop to eye level, improves airflow and packs flat for travel.",
    price: 34.99,
    category: "Desk",
    image: unsplash("photo-1572569511254-d8f925fe2cbb"),
    rating: 4.6,
    reviews: 207,
    features: ["Six height settings", "Passive heat dissipation", "Folds flat (< 10 mm)", "Fits 11–17 inch laptops"],
    specs: [
      { label: "Material", value: "6063 aluminium" },
      { label: "Capacity", value: "Up to 10 kg" },
      { label: "Weight", value: "260 g" },
    ],
  },
  {
    id: 12,
    name: "Orbit 1080p Webcam",
    tagline: "Look sharp on every call",
    description:
      "A 1080p / 60 fps webcam with auto-light correction, dual noise-reducing mics and a physical privacy shutter.",
    price: 59.99,
    compareAt: 74.99,
    category: "Displays",
    image: unsplash("photo-1587826080692-f439cd0b70da"),
    rating: 4.2,
    reviews: 76,
    badge: "Sale",
    features: ["1080p at 60 fps", "Auto light correction", "Dual noise-reducing mics", "Privacy shutter"],
    specs: [
      { label: "Field of view", value: "90°" },
      { label: "Mount", value: "Monitor clip / tripod" },
      { label: "Connection", value: "USB-C" },
    ],
  },
];
