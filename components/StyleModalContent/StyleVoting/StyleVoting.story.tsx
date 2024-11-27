import StyleVoting from ".";

export default {
  title: "Style Voting",
};

const Props = {
  votes: 100,
  compareVotes: 87,
  styleIcon: "🏃‍♂️🎽",
  styleName: "athletic",
  compareIcon: "⚡💥",
  compareName: "edgy",
  styleId: "1234",
  setRecords: () => {},
};

export const StyleVotingComponent = () => <StyleVoting {...Props} />;
