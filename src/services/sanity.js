import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "kwqm869g",
  dataset: "production",
  apiVersion: "2021-09-29",
  useCdn: true,
  ignoreBrowserTokenWarning: true,
  token:
    "skTGQXptWkhjGXymuBStmH61Km9NpmwxJ26Do852bMeH7ubAZ8huN0pGY9Gs5NWEbXMPJVd62fmcA0W0yQ5hBqmVyU0OrnaoAwKL1xep5PdkehkmgA8vA12uiOMQ684CxJZoQ99D0g6j4npruc2pxJgFIZ7rEQQLlqujfRuCxQijqgwP3kkC",
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
