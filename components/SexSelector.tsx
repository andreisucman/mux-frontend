import React, { useCallback, useContext } from "react";
import { SegmentedControl } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
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

type Props = {
  updateOnServer?: boolean;
};

export default function SexSelector({ updateOnServer }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { demographics, email } = userDetails || {};
  const { sex } = demographics || {};

  const handleChangeSex = useCallback(
    async (value: string) => {
      setUserDetails((prev: UserDataType) => ({
        ...(prev || {}),
        demographics: { ...(prev || {}).demographics, sex: value },
      }));

      if (updateOnServer && !email)
        callTheServer({ endpoint: "updateSex", method: "POST", body: { sex } });
    },
    [demographics]
  );

  return (
    <SegmentedControl
      value={sex || "female"}
      data={sexes}
      size="xs"
      style={{ zIndex: 0 }}
      onChange={(value) => handleChangeSex(value)}
    />
  );
}
