import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Checkbox, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { getFromLocalStorage } from "@/helpers/localStorage";
import { daysFrom } from "@/helpers/utils";
import CreateATaskContent from "../CreateATaskContent";
import EditATaskContent from "../EditATaskContent";
import { RawTaskType } from "./types";
import classes from "./AddATaskContainer.module.css";

type Props = {
  handleSaveTask: (args: any) => Promise<void>;
};

export default function AddATaskContainer({ handleSaveTask }: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { isLoading: isRoutineButtonLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);
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
  const [exampleVideoId, setExampleVideoId] = useState("");
  const [selectedDestinationRoutine, setSelectedDestinationRoutine] = useState("");
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

  const { nextRoutine, latestProgressImages, concerns } = userDetails || {};

  const partsScanned = useMemo(() => {
    const entries = Object.entries(latestProgressImages || {}).filter((gr) => Boolean(gr[1]));
    return entries.map((gr) => gr[0]);
  }, [latestProgressImages]);

  const handleCreateTask = async () => {
    if (isLoading) return;

    setError("");

    if (taskName.trim().length < 10) {
      setError("At least 10 characters for task name");
      return;
    }

    setIsLoading(true);

    const response = await callTheServer({
      endpoint: "createTaskFromDescription",
      method: "POST",
      body: { name: taskName, concern: selectedConcern, part: selectedPart },
    });

    if (response.status === 200) {
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }
      setRawTask({ ...response.message, exampleVideoId });
      setStep(2);
    }

    setIsLoading(false);
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
        exampleVideoId,
      }));
    }
  };

  const handleEnableDrafting = async (enable: boolean) => {
    setEnableDrafting(enable);
  };

  const handleRedirectToScan = () => {
    router.push("/select-part");
    modals.closeAll();
  };

  useEffect(() => {
    setEnableDrafting(!!savedEnableDrafting);
  }, [savedEnableDrafting]);

  const notScanned = partsScanned.length === 0;
  const noDescriptionAndInstruction = !rawTask?.description && !rawTask?.instruction;
  const disableCreate = !taskName || !selectedConcern || !selectedPart || notScanned;
  const disableSave =
    !selectedConcern ||
    !selectedPart ||
    !rawTask?.description ||
    !rawTask?.instruction ||
    notScanned;

  return (
    <Stack className={classes.container}>
      {partsScanned.length === 0 && (
        <Alert p="0.5rem 1rem">
          You need to{" "}
          <span
            onClick={handleRedirectToScan}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            scan
          </span>{" "}
          yourself first.
        </Alert>
      )}
      {isLoading && <Loader type="bars" size={48} className={classes.loader} />}
      {!isLoading && step < 3 && (
        <>
          <Stack flex={1}>
            {step === 1 && (
              <CreateATaskContent
                error={error}
                allConcerns={concerns || []}
                allParts={partsScanned}
                taskName={taskName}
                selectedConcern={selectedConcern}
                selectedPart={selectedPart}
                exampleVideoId={exampleVideoId}
                setExampleVideoId={setExampleVideoId}
                setSelectedConcern={setSelectedConcern}
                setSelectedPart={setSelectedPart}
                setTaskName={setTaskName}
                setError={setError}
              />
            )}
            {step === 2 && (
              <>
                {error && <Alert p="0.5rem 1rem">{error}</Alert>}
                <EditATaskContent
                  date={date}
                  rawTask={rawTask}
                  frequency={frequency}
                  previewData={datesPreview}
                  selectedDestinationRoutine={selectedDestinationRoutine}
                  setDate={setDate}
                  setRawTask={setRawTask}
                  setFrequency={setFrequency}
                  setSelectedDestinationRoutine={setSelectedDestinationRoutine}
                />
              </>
            )}
          </Stack>

          <Stack className={classes.buttonsGroup}>
            {step === 1 && (
              <Checkbox
                disabled={notScanned}
                label="Enable drafting"
                checked={enableDrafting}
                onChange={(e) => handleEnableDrafting(e.currentTarget.checked)}
              />
            )}
            {step === 1 && noDescriptionAndInstruction && (
              <>
                <Button
                  variant={"default"}
                  loading={isLoading}
                  disabled={disableCreate}
                  onClick={onCreateManuallyClick}
                >
                  Create task manually
                </Button>
                <Button
                  variant={"filled"}
                  loading={isRoutineButtonLoading}
                  disabled={isRoutineButtonLoading}
                  onClick={onCreateRoutineClick}
                >
                  Suggest me a routine
                </Button>
              </>
            )}
            {step === 2 && rawTask && (
              <Button
                loading={isLoading}
                disabled={disableSave}
                onClick={() =>
                  handleSaveTask({
                    concern: selectedConcern,
                    part: selectedPart,
                    selectedDestinationRoutine,
                    date,
                    frequency,
                    isLoading,
                    rawTask,
                    exampleVideoId,
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
