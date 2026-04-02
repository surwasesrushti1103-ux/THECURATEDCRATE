import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Simple env parser
const env = fs.readFileSync(".env", "utf8");
const envMap = env.split("\n").reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2].replace(/^["']|["']$/g, "");
  return acc;
}, {});

const SUPABASE_URL = envMap["VITE_SUPABASE_URL"];
const SUPABASE_ANON_KEY = envMap["VITE_SUPABASE_ANON_KEY"];

console.log("Connecting to:", SUPABASE_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  {
    name: "Handcrafted Sunflower Keychain",
    price: 30,
    description: "A beautiful hand-knitted sunflower keychain to brighten up your accessories.",
    story: "Created by talented homemakers exploring their creative passions.",
    image: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=500&q=80",
    artisan_name: "Varsha",
    artisan_location: "Airoli, Maharashtra",
    craft_process: "Each piece is uniquely handcrafted with high-quality yarn.",
    category: "Decor"
  },
  {
    name: "Miniature Canvas Painting",
    price: 50,
    description: "A lovely mini frame painting of a scenic sunset, perfect for desks.",
    story: "Painted by traditional artists bringing scenic vibes to miniature canvases.",
    image: "https://images.unsplash.com/photo-1579762715111-a6ce9b342082?w=500&q=80",
    artisan_name: "Suresh Artist",
    artisan_location: "Pune, Maharashtra",
    craft_process: "Hand painted using fine acrylics on a miniature canvas.",
    category: "Decor"
  },
  {
    name: "Terracotta Diya Set",
    price: 45,
    description: "Set of two traditionally crafted and painted clay diyas.",
    story: "Made by generations of potters using local clay.",
    image: "https://images.unsplash.com/photo-1605001011158-75c083dddfbb?w=500&q=80",
    artisan_name: "Ramesh Prajapati",
    artisan_location: "Kutch, Gujarat",
    craft_process: "Molded from pure clay and baked in traditional kilns.",
    category: "Pottery"
  },
  {
    name: "Handmade Paper Bookmark",
    price: 20,
    description: "Beautiful floral pressed eco-friendly paper bookmark.",
    story: "Using recycled paper and real dry flowers to create tiny pieces of art.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    artisan_name: "Priya Creations",
    artisan_location: "Bengaluru, Karnataka",
    craft_process: "Made using upcycled cotton waste and infused with real dried petals.",
    category: "Stationery"
  },
  {
    name: "Wooden Block Print Stamp",
    price: 80,
    description: "A beautiful hand-carved miniature wooden block for block printing or decoration.",
    story: "Carved patiently by master block makers using aged teakwood.",
    image: "https://images.unsplash.com/photo-1622396482186-b4b9b00cd5c3?w=500&q=80",
    artisan_name: "Abdul Woodworks",
    artisan_location: "Jaipur, Rajasthan",
    craft_process: "Hand chiseled block from locally sourced seasoned wood.",
    category: "Wood Craft"
  }
];

async function seed() {
  const { data, error } = await supabase.from('products').insert(products);
  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully inserted 5 mock products into Supabase!");
  }
}

seed();
