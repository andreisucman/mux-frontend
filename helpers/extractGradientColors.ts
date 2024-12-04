export default function extractGradientColors(gradientString: string) {
  let colors = [];
  try {
    gradientString = gradientString.replace(/\s+/g, " ").trim();

    const regex =
      /#([0-9A-Fa-f]{3,8})|rgba?\((\d+), (\d+), (\d+)(?:, (\d+(\.\d+)?))?\)|hsla?\((\d+), (\d+)%?, (\d+)%?(?:, (\d+(\.\d+)?))?\)/g;
    colors = [];
    let match;

    while ((match = regex.exec(gradientString)) !== null) {
      if (match[1]) {
        colors.push(`#${match[1]}`);
      } else if (match[2]) {
        colors.push(`rgba(${match[2]}, ${match[3]}, ${match[4]}, ${match[5] || 1})`);
      } else if (match[7]) {
        colors.push(`hsla(${match[7]}, ${match[8]}%, ${match[9]}%, ${match[10] || 1})`);
      }
    }
  } catch (err) {
    console.log("Error in extractGradientColors: ", err);
  } finally {
    return colors;
  }
}
