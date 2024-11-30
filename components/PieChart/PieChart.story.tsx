import PieChartComponent from ".";

export default {
  title: "Pie Chart Component",
};

const props = {
  data: [
    { name: "eat", value: 75, color: "red" },
    { name: "skip", value: 25, color: "#f21616" },
  ],
  image: "https://myo-data.nyc3.cdn.digitaloceanspaces.com/soup.jpg",
};

export const PieChartDemo = () => <PieChartComponent {...props} />;
