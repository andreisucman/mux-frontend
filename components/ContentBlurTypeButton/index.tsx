import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IconEye, IconEyeOff, IconMoodOff, IconMoodSmile } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Checkbox, Menu, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { BlurredUrlType } from "@/types/global";
import BlurLoadingOverlay from "../BlurLoadingOverlay";
import classes from "./ContentBlurTypeButton.module.css";

const displayTypes = [
  { label: "Original", icon: <IconMoodSmile className="icon" />, value: "original" },
  { label: "Eyes blurred", icon: <IconEyeOff className="icon" />, value: "eyes" },
  { label: "Face blurred", icon: <IconMoodOff className="icon" />, value: "face" },
];

type Props = {
  hash?: string;
  contentId: string;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  currentMain: BlurredUrlType;
  contentCategory: "progress" | "proof" | "style";
  updateRecord?: (...args: any) => void;
  customStyles?: { [key: string]: any };
};

export default function ContentBlurTypeButton({
  contentId,
  position = "top-right",
  hash,
  currentMain,
  contentCategory,
  updateRecord,
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

  const pollBlurProgressStatus = useCallback(async (hash: string, blurType: string) => {
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

  const handleBlurError = (hash: string, error: string) => {
    setProgress(0);
    setIsBlurLoading(false);
    clearInterval(intervalRef.current || undefined);
    saveToLocalStorage("blurAnalyses", { [hash]: false }, "add");
    openErrorModal({ description: error });
  };

  const handleBlurComplete = (message: { [key: string]: any }) => {
    setIsBlurLoading(false);
    setProgress(0);
    clearInterval(intervalRef.current || undefined);
    saveToLocalStorage("blurAnalyses", { [message.hash]: false }, "add");
    updateRecord && updateRecord(message);
  };

  const handleSelect = useCallback(
    async (blurType: "original" | "eyes" | "face") => {
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
            if (updateRecord) {
              updateRecord({
                contentId,
                ...response.message,
              });
              setIsBlurLoading(false);
            }
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
          onChange={() => handleSelect(item.value as "original")}
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
      <BlurLoadingOverlay isLoading={isBlurLoading} progress={progress} />
      <Menu
        trigger="click"
        withinPortal={false}
        trapFocus={false}
        styles={{ dropdown: { pointerEvents: "all" } }}
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
            <IconEye />
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
