import StyleVoting from ".";

export default {
  title: "Style Voting",
};

const props = {
  votes: 100,
  compareVotes: 87,
  styleIcon: "🏃‍♂️🎽",
  styleName: "athletic",
  compareIcon: "⚡💥",
  compareName: "edgy",
  styleId: "1234",
  setRecords: () => {},
};

export const StyleVotingComponent = () => <StyleVoting {...props} />;
