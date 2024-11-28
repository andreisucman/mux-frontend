import VotesCountIndicator from ".";

export default {
  title: "Votes Count Indicator",
};

const props = {
  highestVotes: 100,
};

export const VotesCountIndicatorComponent = () => <VotesCountIndicator {...props} />;
