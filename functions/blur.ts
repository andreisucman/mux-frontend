import React from "react";
import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";
import uploadToSpaces from "./uploadToSpaces";

type OnBlurClickProps = {
  blurType: "eyes" | "face";
  originalUrl: string;
  faceBlurredUrl: string;
  eyesBlurredUrl: string;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  setFaceBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setEyesBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
};

interface OnBlurVideoClickProps extends OnBlurClickProps {
  handlePoll: (hash: string, blurType: "face" | "eyes") => void;
  setIsBlurLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

type BlurProps = {
  blurType: "eyes" | "face";
  type: "image" | "video";
  url: string;
};

async function blur({ url, blurType, type }: BlurProps) {
  if (!url) return;

  try {
    const spacesUrls = await uploadToSpaces({
      itemsArray: [url],
      mime: type === "image" ? "image/jpeg" : "video/webm",
    });

    const response = await callTheServer({
      endpoint: type === "image" ? "blurImage" : "blurVideo",
      server: "processing",
      method: "POST",
      body: { url: spacesUrls[0], blurType },
    });

    if (response.status === 200) {
      if (response.message) {
        return response.message;
      }
      if (response.error) {
        openErrorModal({
          description: response.error,
        });
      }
    }
  } catch (err) {
    console.log("Error in blur: ", err);
    throw err;
  }
}

export async function onBlurImageClick({
  blurType,
  originalUrl,
  faceBlurredUrl,
  eyesBlurredUrl,
  setLocalUrl,
  setFaceBlurredUrl,
  setEyesBlurredUrl,
}: OnBlurClickProps) {
  if (!originalUrl) return;
  try {
    if (blurType === "face") {
      if (!faceBlurredUrl) {
        const blurredImageResponse = await blur({
          url: originalUrl,
          blurType: "face",
          type: "image",
        });
        setFaceBlurredUrl(blurredImageResponse.url);
        setLocalUrl(blurredImageResponse.url);
      } else {
        setLocalUrl(faceBlurredUrl);
      }
    } else if (blurType === "eyes") {
      if (!eyesBlurredUrl) {
        const blurredImageResponse = await blur({
          url: originalUrl,
          blurType: "eyes",
          type: "image",
        });

        setEyesBlurredUrl(blurredImageResponse.url);
        setLocalUrl(blurredImageResponse.url);
      } else {
        setLocalUrl(eyesBlurredUrl);
      }
    } else {
      setLocalUrl(originalUrl);
    }
  } catch (err) {
    console.log("Error in onBlurImageClick: ", err);
    openErrorModal();
  }
}

export async function onBlurVideoClick({
  blurType,
  originalUrl,
  faceBlurredUrl,
  eyesBlurredUrl,
  setLocalUrl,
  setFaceBlurredUrl,
  setEyesBlurredUrl,
  handlePoll,
  setIsBlurLoading,
}: OnBlurVideoClickProps) {
  try {
    setIsBlurLoading(true);

    if (blurType === "face") {
      if (!faceBlurredUrl) {
        const blurredVideoResponse = await blur({
          url: originalUrl,
          blurType: "face",
          type: "video",
        });

        const { url, hash } = blurredVideoResponse;

        if (url) {
          setLocalUrl(url);
          setFaceBlurredUrl(url);
          setIsBlurLoading(false);
        } else if (hash) {
          handlePoll(hash, blurType);
        }
      } else {
        setLocalUrl(faceBlurredUrl);
        setIsBlurLoading(false);
      }
    } else if (blurType === "eyes") {
      if (!eyesBlurredUrl) {
        const blurredVideoResponse = await blur({
          url: originalUrl,
          blurType: "eyes",
          type: "video",
        });

        const { url, hash } = blurredVideoResponse;

        if (url) {
          setEyesBlurredUrl(url);
          setLocalUrl(url);
          setIsBlurLoading(false);
        } else if (hash) {
          handlePoll(hash, blurType);
        }
      } else {
        setLocalUrl(eyesBlurredUrl);
        setIsBlurLoading(false);
      }
    } else {
      setLocalUrl(originalUrl);
      setIsBlurLoading(false);
    }
  } catch (err) {
    console.log("Error in onBlurVideoClick: ", err);
    openErrorModal();
  }
}
