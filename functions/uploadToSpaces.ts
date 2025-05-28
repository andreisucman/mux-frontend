import { nanoid } from "nanoid";
import { resizeImage } from "@/helpers/image";
import callTheServer from "./callTheServer";

/**
 * Supported media categories for upload.
 */
type MediaCategory = "image" | "video" | "audio" | "other";

interface Props {
  /**
   * Array containing either URLs (string) or File/Blob objects.
   */
  itemsArray: (string | File | Blob)[];
  /**
   * Optional maximum size (px) when resizing images.
   * Ignored for audio/video/other files.
   * @default 1280
   */
  imageSize?: number;
  /**
   * Optional target mime type *for images only* (e.g. "image/webp").
   */
  mime?: string;
}

/**
 * Maps a MIME type to a sensible file‑extension.
 */
const getExtensionFromMime = (mime?: string): string => {
  if (!mime) return "";
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/ogg": ".ogg",
  };
  return map[mime] ?? "";
};

export default async function uploadToSpaces({ itemsArray, imageSize = 1280, mime }: Props) {
  try {
    const filteredItemsArray = itemsArray.filter(Boolean);
    if (filteredItemsArray.length === 0) return [] as string[];

    const formData = new FormData();

    for (let i = 0; i < filteredItemsArray.length; i++) {
      const item = filteredItemsArray[i];
      let blob: Blob;

      // ────────────────────────────────────────────────────────────────
      // 1. Detect MIME type
      // ────────────────────────────────────────────────────────────────
      let itemMime: string | undefined;

      if (item instanceof File || item instanceof Blob) {
        itemMime = item.type;
        console.log("item", item, "itemMime 65", itemMime);
      } else if (typeof item === "string") {
        // Try a HEAD request first to avoid downloading the asset twice
        const head = await fetch(item, { method: "HEAD" });
        itemMime = head.headers.get("Content-Type") || undefined;
        console.log("itemMime 70", itemMime);
      }

      // ────────────────────────────────────────────────────────────────
      // 2. Categorise media
      // ────────────────────────────────────────────────────────────────
      let category: MediaCategory = "other";
      if (itemMime?.startsWith("image/")) category = "image";
      else if (itemMime?.startsWith("video/")) category = "video";
      else if (itemMime?.startsWith("audio/")) category = "audio";

      // ────────────────────────────────────────────────────────────────
      // 3. Obtain / transform the Blob
      // ────────────────────────────────────────────────────────────────
      if (category === "image") {
        // 👉 Resize images (whether URL or File/Blob)
        if (typeof item === "string") {
          const resizedUrl = await resizeImage({
            url: item,
            maxSize: imageSize,
            mime: mime || itemMime,
          });
          const res = await fetch(resizedUrl);
          blob = await res.blob();
        } else {
          const blobUrl = URL.createObjectURL(item);
          const resizedUrl = await resizeImage({
            url: blobUrl,
            maxSize: imageSize,
            mime: mime || itemMime,
          });
          const res = await fetch(resizedUrl);
          blob = await res.blob();
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        // 👉 For video/audio/other simply obtain the blob
        if (typeof item === "string") {
          const res = await fetch(item);
          blob = await res.blob();
        } else {
          blob = item;
        }
      }

      // ────────────────────────────────────────────────────────────────
      // 4. Append to FormData with a helpful filename
      // ────────────────────────────────────────────────────────────────
      const extension = getExtensionFromMime(itemMime);
      formData.append("files", blob, `${nanoid()}-${category}-file-${i}${extension}`);
    }

    // ────────────────────────────────────────────────────────────────
    // 5. Upload to Spaces
    // ────────────────────────────────────────────────────────────────
    const response = await callTheServer({
      endpoint: "uploadToSpaces",
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) throw new Error(response.error);

    return response.message as string[];
  } catch (err) {
    console.error("Error while uploading files:", err);
    throw err;
  }
}
