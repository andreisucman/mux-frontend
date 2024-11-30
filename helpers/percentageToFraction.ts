export default function percentageToFraction(percentage: number) {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

  if (percentage === 100) return "everything";
  if (percentage === 0) return "";

  let numerator = percentage;
  let denominator = 10;

  function gcd(a: number, b: number) {
    while (b) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  let divisor = gcd(numerator, denominator);
  numerator = numerator / divisor;
  denominator = denominator / divisor;

  return `${numerator}/${denominator}`;
}
