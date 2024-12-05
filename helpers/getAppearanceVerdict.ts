export default function getAppearanceVerdict(score: number, isPotential?: boolean) {
  let text = "";

  if (score > 0) {
    text = "You could get some work";
  }

  if (score > 40) {
    text = `You ${isPotential ? "can look" : "look"} okay`;
  }

  if (score > 60) {
    text = `You ${isPotential ? "can look" : "look"} good`;
  }

  if (score > 80) {
    text = `You ${isPotential ? "can look" : "look"} excellent`;
  }

  return text;
}
