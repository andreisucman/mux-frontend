import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IconBlur } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Checkbox, Menu, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { BlurredUrlType } from "@/types/global";
import ProgressLoadingOverlay from "../ProgressLoadingOverlay";
import classes from "./ContentBlurTypeButton.module.css";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";

type HandleUpdateRecordType = {
  contentId: string;
  updateObject: { [key: string]: any };
};

type Props = {
  hash?: string;
  contentId: string;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  currentMain: BlurredUrlType;
  contentCategory: "progress" | "proof" | "style";
  setRecords?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  onComplete?: (props: { [key: string]: any }) => void;
  customStyles?: { [key: string]: any };
};

const displayTypes = [
  { label: "Original", value: "original" },
  { label: "Eyes blurred", value: "eyes" },
  { label: "Face blurred", value: "face" },
];

export default function ContentBlurTypeButton({
  contentId,
  position = "top-right",
  hash,
  currentMain,
  contentCategory,
  setRecords,
  onComplete,
  customStyles,
}: Props) {
  const { blurType, setBlurType } = useContext(BlurChoicesContext);
  const [isBlurLoading, setIsBlurLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDisplayType, setSelectedDisplayType] = useState<{
    label: string;
    value: string;
  }>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pollBlurProgressStatus = useCallback(async (hash: string, blurType: BlurTypeEnum) => {
    try {
      setIsBlurLoading(true);
      const response = await callTheServer({
        endpoint: "checkVideoBlurStatus",
        method: "POST",
        body: { hash, blurType },
      });

      if (response.status === 200) {
        if (response.error) {
          handleBlurError(hash, response.error);
          return;
        }

        const { progress, isRunning } = response.message;

        if (isRunning) {
          setProgress(progress);
        } else {
          handleBlurComplete(response.message);
        }
      }
    } catch (err) {
      handleBlurError(hash, "Error during polling.");
    }
  }, []);

  const handleBlurError = useCallback(
    (hash: string, error: string) => {
      setProgress(0);
      setIsBlurLoading(false);
      clearInterval(intervalRef.current || undefined);
      saveToLocalStorage("blurAnalyses", { [hash]: false }, "add");
      openErrorModal({ description: error });
    },
    [intervalRef.current]
  );

  const handleUpdateRecord = useCallback(({ contentId, updateObject }: HandleUpdateRecordType) => {
    try {
      if (setRecords)
        setRecords((prev: any) =>
          prev?.map((rec: any) => (rec._id === contentId ? { ...rec, ...updateObject } : rec))
        );
      if (onComplete) onComplete(updateObject);
    } catch (err) {
      console.log("Error in handleUpdateRecord: ", err);
    }
  }, []);

  const handleBlurComplete = useCallback(
    (message: { [key: string]: any }) => {
      setIsBlurLoading(false);
      setProgress(0);
      clearInterval(intervalRef.current || undefined);
      saveToLocalStorage("blurAnalyses", { [message.hash]: false }, "add");
      handleUpdateRecord({ contentId, updateObject: message });
    },
    [contentId, intervalRef.current]
  );

  const handleSelect = useCallback(
    async (blurType: BlurTypeEnum) => {
      const relevantDisplayType = displayTypes.find((obj) => obj.value === blurType);
      if (!relevantDisplayType) return;

      setIsBlurLoading(true);
      setSelectedDisplayType(relevantDisplayType);
      setBlurType(blurType);

      try {
        const response = await callTheServer({
          endpoint: "updateContentBlurType",
          method: "POST",
          body: { blurType, contentCategory, contentId },
        });

        if (response.status === 200) {
          const { hash, mainUrl, images } = response.message;

          if (mainUrl || images) {
            handleUpdateRecord({
              contentId,
              ...response.message,
            });
            setIsBlurLoading(false);
          } else if (hash) {
            saveToLocalStorage("blurAnalyses", { [hash]: false }, "add");
            intervalRef.current = setInterval(() => pollBlurProgressStatus(hash, blurType), 3000);
          }
        }
      } catch (err) {
        setIsBlurLoading(false);
        console.error("Error in handleSelect: ", err);
      } finally {
        modals.closeAll();
      }
    },
    [contentCategory, contentId, intervalRef.current]
  );

  const items = useMemo(
    () =>
      displayTypes.map((item, i) => (
        <Checkbox
          key={i}
          checked={selectedDisplayType?.value === item.value}
          size="md"
          label={item.label}
          onChange={() => handleSelect(item.value as BlurTypeEnum)}
          readOnly
        />
      )),
    [selectedDisplayType?.value]
  );

  useEffect(() => {
    const relevantDisplayType = displayTypes.find((obj) => obj.value === currentMain?.name);
    relevantDisplayType && setSelectedDisplayType(relevantDisplayType);
  }, [currentMain]);

  useEffect(() => {
    if (!hash) return;
    if (!blurType) return;

    const blurAnalyses: { [key: string]: any } | null = getFromLocalStorage("blurAnalyses");

    if (blurAnalyses) {
      const isLoading = blurAnalyses[hash];

      if (isLoading) {
        intervalRef.current = setInterval(() => pollBlurProgressStatus(hash, blurType), 3000);

        setIsBlurLoading(isLoading);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hash, blurType]);

  return (
    <Stack className={classes.container}>
      <ProgressLoadingOverlay isLoading={isBlurLoading} progress={progress} />
      <Menu
        trigger="click"
        withinPortal={false}
        trapFocus={false}
        classNames={{ dropdown: classes.dropdown }}
      >
        <Menu.Target>
          <ActionIcon
            variant="default"
            disabled={isBlurLoading}
            className={cn(classes.target, {
              [classes.topRight]: position === "top-right",
              [classes.topLeft]: position === "top-left",
              [classes.bottomRight]: position === "bottom-right",
              [classes.bottomLeft]: position === "bottom-left",
            })}
            style={customStyles || {}}
          >
            <IconBlur className="icon" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {items.map((item, i) => (
            <Menu.Item key={i}>{item}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Stack>
  );
}
