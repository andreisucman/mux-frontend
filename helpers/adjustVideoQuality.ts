type Props = {
  width: number;
  height: number;
  frameRate: number;
};

export default function adjustVideoQuality({ width, height, frameRate }: Props) {
  const baseBitrate = 5 * 1024 * 1024;

  const resolutionFactor = (width * height) / (1920 * 1080);
  const frameRateFactor = frameRate / 30;

  const bitrate = baseBitrate * resolutionFactor * frameRateFactor;

  return Math.min(10 * 1024 * 1024, bitrate);
}
