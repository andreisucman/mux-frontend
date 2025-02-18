import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Loader, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import CreateATaskContent from "../CreateATaskContent";
import EditATaskContent from "../EditATaskContent";
import { RawTaskType } from "./types";
import classes from "./AddATaskContainer.module.css";

type Props = {
  timeZone?: string;
  onCreateRoutineClick: (args?: any) => void;
  handleSaveTask: (args: any) => Promise<void>;
};

type HandleCreateTaskProps = {
  concern: string | null;
  part: string | null;
  timeZone?: string;
  isLoading: boolean;
  description: string;
};

export default function AddATaskContainer({
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
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const handleCreateTask = useCallback(
    async ({ concern, part, timeZone, isLoading, description }: HandleCreateTaskProps) => {
      if (!timeZone) return;
      if (isLoading) return;
      if (!description) return;

      try {
        setError("");
        setIsLoading(true);

        const response = await callTheServer({
          endpoint: "createTaskFromDescription",
          method: "POST",
          body: { concern, part, description, timeZone },
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

  const { nextRoutine, nextScan, subscriptions, concerns } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } = checkSubscriptionActivity(
    ["improvement"],
    subscriptions
  );

  const scannedParts = nextScan?.filter((r) => r.date).map((r) => r.part);
  const isCreateRoutineInCooldown = nextRoutine?.every((ro) => ro.date && new Date(ro.date || 0) > new Date());
  const earliestCreateRoutineDate =
    nextRoutine && nextRoutine.length
      ? Math.min(...nextRoutine.map((r) => (r.date ? new Date(r.date).getTime() : Infinity)))
      : null;

  const cooldownButtonText = `Improvement assistant after ${formatDate({ date: new Date(earliestCreateRoutineDate || new Date()), hideYear: true })}`;

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
              <CreateATaskContent
                allConcerns={concerns}
                allParts={scannedParts || []}
                selectedConcern={selectedConcern}
                selectedPart={selectedPart}
                setSelectedConcern={setSelectedConcern}
                setSelectedPart={setSelectedPart}
                description={description}
                setDescription={setDescription}
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
                  loading={isLoading}
                  disabled={!selectedConcern || !selectedPart || !description}
                  onClick={() =>
                    handleCreateTask({
                      concern: selectedConcern,
                      part: selectedPart,
                      isLoading,
                      timeZone,
                      description,
                    })
                  }
                >
                  Create task
                </Button>
                <Button
                  disabled={!!isCreateRoutineInCooldown}
                  onClick={() => {
                    onCreateRoutineClick({ isSubscriptionActive, isTrialUsed });
                  }}
                >
                  {isCreateRoutineInCooldown ? cooldownButtonText : "Create weekly routine"}
                </Button>
              </>
            )}

            {step === 2 && rawTask && (
              <Button
                loading={isLoading}
                disabled={!selectedConcern || !selectedPart}
                onClick={() =>
                  handleSaveTask({
                    concern: selectedConcern,
                    part: selectedPart,
                    timeZone,
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
              <Button variant="default" disabled={isLoading} onClick={() => setStep(1)}>
                Return
              </Button>
            )}
            {step === 1 && rawTask && (
              <Button variant="default" disabled={isLoading} onClick={() => setStep(2)}>
                Next
              </Button>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
