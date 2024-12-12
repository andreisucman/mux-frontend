import React, { memo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconFocus } from "@tabler/icons-react";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import { StyleAnalysisType, StyleGoalsType, TypeEnum } from "@/types/global";
import { outlookStyles } from "./outlookStyles";
import StyleGoalModalRow from "./StyleGoalModalRow";
import classes from "./SelectStyleContent.module.css";

type Props = {
  userId: string;
  relevantStyleAnalysis: StyleAnalysisType;
  type: TypeEnum;
  styleName?: string;
};

function SelectStyleGoalModalContent({ type, userId, relevantStyleAnalysis, styleName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedGoal, setSelectedGoal] = useState<StyleGoalsType>();

  const { _id: styleId } = relevantStyleAnalysis || {};

  const startSuggestAnalysis = async () => {
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
        const redirectUrl = encodeURIComponent(`/analysis/style?type=${type}`);
        const onErrorRedirectUrl = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
        router.push(
          `/wait?type=${type}&operationKey=${`style-${type}`}&redirectUrl=${redirectUrl}&onErrorRedirectUrl=${onErrorRedirectUrl}`
        );
        saveToLocalStorage("runningAnalyses", { [`style-${type}`]: true }, "add");
      }
    } catch (err) {
      console.log("Error in startSuggestAnalysis: ", err);
    }
  };

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
