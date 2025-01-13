import React, { useContext } from "react";
import { SegmentedControl } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { sexIcons } from "@/helpers/icons";
import { UserDataType } from "@/types/global";

const sexes = [
  {
    value: "female",
    label: sexIcons.female,
  },
  {
    value: "male",
    label: sexIcons.male,
  },
];

export default function SexSelector() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  const handleChangeSex = (value: string) =>
    setUserDetails((prev: UserDataType) => ({
      ...(prev || {}),
      demographics: { ...(prev || {}).demographics, sex: value },
    }));

  return (
    <SegmentedControl
      value={sex || "female"}
      data={sexes}
      size="xs"
      onChange={(value) => handleChangeSex(value)}
    />
  );
}
