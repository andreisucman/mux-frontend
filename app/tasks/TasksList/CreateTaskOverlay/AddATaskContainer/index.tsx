import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Loader, Stack, Text } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import { TypeEnum } from "@/types/global";
import EditATaskContent from "../EditATaskContent";
import { HandleSaveTaskProps, RawTaskType } from "./types";
import classes from "./AddATaskContainer.module.css";

type Props = {
  type: TypeEnum;
  timeZone?: string;
  onCreateRoutineClick: (args?: any) => void;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
};

type HandleCreateTaskProps = {
  timeZone?: string;
  isLoading: boolean;
  description: string;
};

export default function AddATaskContainer({
  type,
  timeZone,
  handleSaveTask,
  onCreateRoutineClick,
}: Props) {
  const { userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState("");
  const [rawTask, setRawTask] = useState<RawTaskType>();
  const [frequency, setFrequency] = useState<number>(1);
  const [date, setDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState(1);

  const handleCreateTask = useCallback(
    async ({ timeZone, isLoading, description }: HandleCreateTaskProps) => {
      if (!timeZone) return;
      if (isLoading) return;
      if (!description) return;

      try {
        setError("");
        setIsLoading(true);

        const response = await callTheServer({
          endpoint: "createTaskFromDescription",
          method: "POST",
          body: { description, type, timeZone },
        });

        if (response.status === 200) {
          if (response.error) {
            setError(response.error);
          } else {
            setRawTask(response.message);
            setStep(2);
          }
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    },
    []
  );

  const datesPreview = useMemo(() => {
    const dates: string[] = [];
    const distance = Math.round(Math.max(7 / frequency, 1));

    for (let i = 0; i < Math.min(frequency, 7); i++) {
      const finalDate = daysFrom({
        date: date instanceof Date ? date : new Date(),
        days: distance * i,
      });
      dates.push(formatDate({ date: finalDate, hideYear: true }));
    }

    return dates;
  }, [date, frequency]);

  const tasksLeft = datesPreview.length - 3;

  const { nextRoutine, subscriptions } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } = checkSubscriptionActivity(
    ["peek", "improvement"],
    subscriptions
  );
  const typeNextRoutine = nextRoutine?.find((obj) => obj.type === type);
  const isCreateRoutineInCooldown =
    typeNextRoutine && typeNextRoutine.date && new Date(typeNextRoutine.date) > new Date();

  return (
    <Stack className={classes.container}>
      {error && (
        <Text size="xs" className={classes.error}>
          {error}
        </Text>
      )}
      {isLoading && <Loader type="bars" size={48} className={classes.loader} />}
      {!isLoading && step < 3 && (
        <>
          <Stack flex={1}>
            {step === 1 && (
              <TextareaComponent
                text={description}
                setText={setDescription}
                placeholder={
                  type === "head"
                    ? "Moisturizing face with coconut oil"
                    : type === "health"
                      ? "A salad with kinoa and cucumbers"
                      : "Narrow grip incline bench press with a barbell"
                }
              />
            )}
            {step === 2 && (
              <EditATaskContent
                date={date}
                rawTask={rawTask}
                tasksLeft={tasksLeft}
                frequency={frequency}
                previewData={datesPreview}
                setDate={setDate}
                setRawTask={setRawTask}
                setFrequency={setFrequency}
              />
            )}
          </Stack>
          <Stack className={classes.buttonsGroup}>
            {step === 1 && !rawTask && (
              <>
                <Button
                  variant="default"
                  onClick={() => handleCreateTask({ isLoading, timeZone, description })}
                >
                  Create task
                </Button>
                {!isCreateRoutineInCooldown && (
                  <Button
                    disabled={!!isCreateRoutineInCooldown}
                    onClick={() => {
                      console.log("onCreateRoutineClick", onCreateRoutineClick);
                      onCreateRoutineClick({ isSubscriptionActive, isTrialUsed });
                    }}
                  >
                    Create weekly routine
                  </Button>
                )}
              </>
            )}

            {step === 2 && rawTask && (
              <Button
                onClick={() =>
                  handleSaveTask({
                    date,
                    frequency,
                    isLoading,
                    rawTask,
                    setError,
                    setIsLoading,
                  })
                }
              >
                Save task
              </Button>
            )}
            {step === 2 && rawTask && (
              <Button variant="default" onClick={() => setStep(1)}>
                Return
              </Button>
            )}
            {step === 1 && rawTask && (
              <Button variant="default" onClick={() => setStep(2)}>
                Next
              </Button>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
