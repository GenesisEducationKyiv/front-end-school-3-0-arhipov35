import { z } from "zod";
import { trustedDomains } from "../../../shared/constants/trustedDomains";
export const FormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string(),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  coverImage: z.string().refine(
    (url) => {
      if (!url) return true;
      try {
        const parsedUrl = new URL(url);
        if (
          trustedDomains.some((domain) => parsedUrl.hostname.includes(domain))
        ) {
          return true;
        }
        return /\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif)$/i.test(url);
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid image URL",
    }
  ),
});
