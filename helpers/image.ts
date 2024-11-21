export const createImage = (url: string, bypassCORS = false): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    if (bypassCORS) {
      image.src = `${url}?abchys=csuiqp`;
    } else {
      image.src = url;
    }
    image.crossOrigin = "anonymous";
  });

type Props = {
  url: string;
  maxSize: number;
  mime?: string;
};

export async function resizeImage({ url, maxSize, mime }: Props) {
  const img = await createImage(url);
  let image;

  const rCanvas = document.createElement("canvas");
  rCanvas.width = img.naturalWidth;
  rCanvas.height = img.naturalHeight;

  // if the image is big resize it
  if (img.naturalHeight > maxSize || img.naturalWidth > maxSize) {
    const wToH = img.naturalWidth / img.naturalHeight;
    rCanvas.width = wToH > 1 ? maxSize : maxSize * wToH;
    rCanvas.height = wToH > 1 ? maxSize / wToH : maxSize;
  }

  const rCtx = rCanvas.getContext("2d");
  rCtx!.drawImage(img, 0, 0, rCanvas.width, rCanvas.height);
  image = rCanvas.toDataURL(mime, 0.9);

  return image;
}
