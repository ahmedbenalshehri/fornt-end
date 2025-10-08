import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "mhlr2byd",
  dataset: "production",
  apiVersion: "2021-09-29",
  useCdn: true,
  ignoreBrowserTokenWarning: true,
  token:
    "skg2PJzuH566XiEgHT9acOtL6jCzUqdp2uvA4ynTroFCos6MIgHGHtUSHyOWmLfM8dxb90T5i7LYsZrYFwEBZo amVlSec3girfxsu9m3Rp9rK1tgbKT93Nm5EzZPRUO7sQcLcVBtRKqMLIN9o5TcYA52sZYeGgKsk8r3FkAC5ubm YgipCrXQ",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  if (!source) return "/path/to/default-image.jpg"; // Fallback for missing images
  return builder.image(source).quality(50);
  // Compression quality (75 is a good balance) // Automatically choose WebP or JPEG
};

export const urlForLQIP = (source) => {
  if (!source) return "/path/to/default-placeholder.jpg"; // Fallback for missing images
  return builder
    .image(source)
    .blur(10) // Apply blur effect
    .quality(10) // Very low quality for faster loading
    .auto("format"); // Automatically choose WebP or JPEG
};

export default client;
