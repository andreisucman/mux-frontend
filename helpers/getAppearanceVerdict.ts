export default function getAppearanceVerdict(score: number, isPotential?: boolean) {
  let text = "";

  if (score > 0) {
    text = "Your look could use some work";
  }

  if (score > 40) {
    text = `You ${isPotential ? "can look" : "look"} okay`;
  }

  if (score > 80) {
    text = `You ${isPotential ? "can look better" : "look good"}`;
  }

  return text;
}
