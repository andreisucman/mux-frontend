function calculatePercentage(dividend: number, divider: number) {
  if (divider === 0) return 0;
  return Number(((dividend / divider) * 100).toFixed(2));
}

type Props = {
  streaks?: { [key: string]: number };
  requisite: { [key: string]: number };
};

export function calculateRewardTaskCompletion({ streaks, requisite }: Props) {
  if (!streaks || !requisite) return { icon: "", value: 0 };

  try {
    const keys = Object.keys(requisite).filter((key) => key in streaks);
    if (keys.length === 0) return { icon: "", value: 0 };

    let highestKey = keys[0];
    let highestValue = streaks[highestKey] || 0;

    for (const key of keys) {
      if ((streaks[key] || 0) > highestValue) {
        highestKey = key;
        highestValue = streaks[key];
      }
    }

    const percentage = calculatePercentage(highestValue, requisite[highestKey]);
    return { icon: null, value: percentage };
  } catch (err) {
    console.error("Error in calculateRewardTaskCompletion:", err);
  }
}
