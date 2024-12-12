import React, { useCallback, useContext } from "react";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { UserConcernType, UserDataType } from "@/types/global";
import DragAndDrop from "./DragAndDrop";
import classes from "./ConcernsSortCard.module.css";

type Props = {
  type: string;
  disabled?: boolean;
  maxHeight: number;
  concerns: UserConcernType[];
  customStyles?: { [key: string]: any };
};

export default function ConcernsSortCard({
  type,
  concerns,
  disabled,
  maxHeight,
  customStyles,
}: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);

  const saveNewConcerns = useCallback((newConcerns: UserConcernType[]) => {
    try {
      setUserDetails((prev: UserDataType) => ({
        ...prev,
        concerns: newConcerns,
      }));
    } catch (err) {
      console.log("Error in saveNewConcerns: ", err);
    }
  }, []);

  const handleUpdateConcern = useCallback(
    (updatedItem: UserConcernType) => {
      if (!userDetails) return;
      if (!userDetails.concerns) return;

      const updatedConcerns = userDetails.concerns
        .filter((obj) => obj.type === type)
        .map((c) => (c.name === updatedItem.name ? updatedItem : c));

      setUserDetails((prev: UserDataType) => ({
        ...prev,
        concerns: updatedConcerns,
      }));
    },
    [userDetails]
  );

  return (
    <Stack style={customStyles ? customStyles : {}} className={classes.container} mah={maxHeight}>
      <Stack className={classes.wrapper}>
        <DragAndDrop
          disabled={disabled}
          data={concerns}
          onUpdate={saveNewConcerns}
          handleUpdateConcern={handleUpdateConcern}
        />
      </Stack>
    </Stack>
  );
}
