import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Checkbox, Loader, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import addImprovementCoach from "@/helpers/addImprovementCoach";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import { formatDate } from "@/helpers/formatDate";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
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

export default function AddATaskContainer({
  timeZone,
  handleSaveTask,
  onCreateRoutineClick,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawTask, setRawTask] = useState<RawTaskType>();
  const [frequency, setFrequency] = useState<number>(1);
  const [date, setDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState(1);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [taskName, setTaskName] = useState<string>("");
  const [enableDrafting, setEnableDrafting] = useState(false);
  const savedEnableDrafting = getFromLocalStorage("enableDrafting");

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

  const { nextRoutine, latestProgress, subscriptions, concerns } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } = checkSubscriptionActivity(
    ["improvement"],
    subscriptions
  );

  const partsScanned = Object.entries(latestProgress || {})
    .filter((gr) => typeof gr[1] !== "number")
    .filter((gr) => gr[1])
    .map((gr) => gr[0]);

  const isCreateRoutineInCooldown = nextRoutine?.every(
    (ro) => ro.date && new Date(ro.date || 0) > new Date()
  );
  const earliestCreateRoutineDate =
    nextRoutine && nextRoutine.length
      ? Math.min(...nextRoutine.map((r) => (r.date ? new Date(r.date).getTime() : Infinity)))
      : null;

  const cooldownButtonText = `Next weekly routine after ${formatDate({ date: new Date(earliestCreateRoutineDate || new Date()), hideYear: true })}`;

  const handleCreateTask = async () => {
    if (!timeZone) return;
    if (isLoading) return;

    try {
      setError("");
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "createTaskFromDescription",
        method: "POST",
        body: { name: taskName, concern: selectedConcern, part: selectedPart, timeZone },
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
  };

  const onCreateManuallyClick = () => {
    if (enableDrafting) {
      handleCreateTask();
    } else {
      setStep((prev) => prev + 1);
      setRawTask((prev) => ({
        ...prev,
        description: "",
        instruction: "",
      }));
    }
  };

  const handleEnableDrafting = async (enable: boolean) => {
    if (isSubscriptionActive) {
      setEnableDrafting(enable);
      saveToLocalStorage("enableDrafting", enable);
    } else {
      if (enable) {
        const { subscriptions } = userDetails || {};
        const { improvement } = subscriptions || {};
        const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

        addImprovementCoach({
          improvementSubscription: improvement,
          onComplete: () => handleEnableDrafting(true),
          redirectUrl,
          cancelUrl: redirectUrl,
          setUserDetails,
        });
      }
    }
  };

  useEffect(() => {
    setEnableDrafting(!!savedEnableDrafting);
  }, [savedEnableDrafting]);

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
                allConcerns={concerns || []}
                allParts={partsScanned}
                taskName={taskName}
                setTaskName={setTaskName}
                selectedConcern={selectedConcern}
                selectedPart={selectedPart}
                setSelectedConcern={setSelectedConcern}
                setSelectedPart={setSelectedPart}
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
            {step === 1 && (
              <Checkbox
                label="Let the coach draft it for me"
                checked={enableDrafting}
                onChange={(e) => handleEnableDrafting(e.currentTarget.checked)}
              />
            )}
            {step === 1 && !rawTask && (
              <>
                <Button
                  variant={isSubscriptionActive ? "filled" : "default"}
                  loading={isLoading}
                  disabled={!selectedConcern || !selectedPart}
                  onClick={onCreateManuallyClick}
                >
                  Create task manually
                </Button>
                <Button
                  variant={isSubscriptionActive ? "default" : "filled"}
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
                disabled={
                  !selectedConcern || !selectedPart || !rawTask.description || !rawTask.instruction
                }
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
