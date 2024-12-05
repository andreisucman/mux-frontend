import React, { memo, useCallback, useContext, useState } from "react";
import { IconFocus } from "@tabler/icons-react";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import { StyleGoalsType, TypeEnum } from "@/types/global";
import { outlookStyles } from "./outlookStyles";
import StyleGoalModalRow from "./StyleGoalModalRow";
import classes from "./SelectStyleContent.module.css";

type Props = {
  type: TypeEnum;
  styleName?: string;
};

function SelectStyleGoalModalContent({ type, styleName }: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [selectedGoal, setSelectedGoal] = useState<StyleGoalsType>();

  const { _id: userId, latestStyleAnalysis } = userDetails || {};
  const relevantStyleAnalysis = latestStyleAnalysis?.[type as "head"];
  const { _id: styleId } = relevantStyleAnalysis || {};

  const startSuggestAnalysis = useCallback(async () => {
    if (!selectedGoal) return;

    try {
      modals.closeAll();

      const response = await callTheServer({
        endpoint: "startSuggestChangeAnalysis",
        method: "POST",
        body: {
          type,
          userId,
          analysisId: styleId,
          goal: selectedGoal,
        },
      });

      if (response.status === 200) {
        router.push(`/wait?type=${type}&next=${encodeURIComponent(`?type=${type}`)}`);
        saveToLocalStorage("runningAnalyses", { [`style-${type}`]: true }, "add");
      }
    } catch (err) {
      console.log("Error in startSuggestAnalysis: ", err);
    }
  }, [styleId, type, selectedGoal?.name]);

  const styles = outlookStyles.filter((obj) => obj.name !== styleName);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          {styles.map((styleObj, index) => {
            const checked = selectedGoal?.name === styleObj.name;
            const { name, description, icon } = styleObj;
            return (
              <StyleGoalModalRow
                key={index}
                name={name}
                icon={icon}
                checked={checked}
                description={description}
                onChange={setSelectedGoal}
              />
            );
          })}
        </Stack>
      </Stack>
      <Button disabled={!selectedGoal} onClick={startSuggestAnalysis}>
        <IconFocus className={`icon ${classes.icon}`} /> Match
      </Button>
    </Stack>
  );
}

export default memo(SelectStyleGoalModalContent);
