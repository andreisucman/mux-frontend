import { nanoid } from "nanoid";
import { resizeImage } from "@/helpers/image";
import callTheServer from "./callTheServer";

type Props = {
  itemsArray: (string | File | Blob)[];
  imageSize?: number;
  mime?: string;
};

export default async function uploadToSpaces({ itemsArray, imageSize, mime }: Props) {
  try {
    const filteredItemsArray = itemsArray.filter((item) => item);
    if (filteredItemsArray.length === 0) return [];

    const formData = new FormData();

    for (let i = 0; i < filteredItemsArray.length; i++) {
      let blob: Blob;
      const item = filteredItemsArray[i];

      // Determine the MIME type of the current item
      let itemMime: string | undefined;

      if (item instanceof File || item instanceof Blob) {
        itemMime = item.type;
      } else if (typeof item === "string") {
        // For URLs, fetch the Content-Type header
        const response = await fetch(item);
        itemMime = response.headers.get("Content-Type") || undefined;
      }

      if (itemMime && itemMime.startsWith("image/")) {
        // Resize images
        if (typeof item === "string") {
          const resizedImageUrl = await resizeImage({
            url: item,
            maxSize: imageSize ? imageSize : 1280,
            mime: mime || itemMime,
          });
          const response = await fetch(resizedImageUrl);
          blob = await response.blob();
        } else {
          const blobUrl = URL.createObjectURL(item);
          const resizedImageUrl = await resizeImage({
            url: blobUrl,
            maxSize: imageSize ? imageSize : 1280,
            mime: mime || itemMime,
          });
          const response = await fetch(resizedImageUrl);
          blob = await response.blob();
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        // Upload videos or other files without resizing
        if (typeof item === "string") {
          const response = await fetch(item);
          blob = await response.blob();
        } else {
          blob = item;
        }
      }

      formData.append("files", blob, `${nanoid()}-file-${i}`);
    }

    const response = await callTheServer({
      endpoint: "uploadToSpaces",
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      throw new Error(response.error);
    }

    return response.message;
  } catch (err: any) {
    console.error("Error while uploading files:", err);
  }
}
