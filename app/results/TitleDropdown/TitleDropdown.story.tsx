import TitleDropdown from ".";

export default {
  title: "Title Dropdown",
};

const props = {
  titles: [
    { label: "Progress", value: "/results/progress" },
    { label: "Style", value: "/results/style" },
    { label: "Proof", value: "/results/proof" },
  ],
};

export const TItleDropdownComponent = () => <TitleDropdown {...props} />;
