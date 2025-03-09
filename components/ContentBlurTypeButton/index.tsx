import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconBlur } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Checkbox, Group, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { BlurredUrlType } from "@/types/global";
import classes from "./ContentBlurTypeButton.module.css";

type HandleUpdateRecordType = {
  contentId: string;
  updateObject: { [key: string]: any };
};

type Props = {
  contentId: string;
  hash?: string;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  isRelative?: boolean;
  isLoading?: boolean;
  isDisabled: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentMain: BlurredUrlType;
  contentCategory: "progress" | "proof";
  setRecords?: React.Dispatch<React.SetStateAction<any | undefined>>;
  onComplete?: (props: { [key: string]: any }) => void;
  customStyles?: { [key: string]: any };
};

const displayTypes = [
  { label: "Original", value: "original" },
  { label: "Blur eyes", value: "eyes" },
  { label: "Blur face", value: "face" },
];

export default function ContentBlurTypeButton({
  hash,
  contentId,
  isLoading,
  isDisabled,
  position = "top-right",
  isRelative,
  currentMain,
  contentCategory,
  setRecords,
  setIsLoading,
  onComplete,
  customStyles,
}: Props) {
  const { blurType, setBlurType } = useContext(BlurChoicesContext);
  const [selectedDisplayType, setSelectedDisplayType] = useState<{
    label: string;
    value: string;
  }>();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pollBlurProgressStatus = useCallback(async (hash: string, blurType: BlurTypeEnum) => {
    try {
      setIsLoading(true);
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

        const { isRunning, progress: jobProgress } = response.message;

        if (isRunning) {
          setProgress(jobProgress);
        } else {
          handleBlurComplete(response.message);
          setProgress(0);
        }
      }
    } catch (err) {
      handleBlurError(hash, "Error during polling.");
    }
  }, []);

  const handleBlurError = useCallback(
    (hash: string, error: string) => {
      setIsLoading(false);
      clearInterval(intervalRef.current || undefined);
      saveToLocalStorage("blurAnalyses", { [hash]: false }, "add");
      openErrorModal({ description: error });
      setProgress(0);
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
      setIsLoading(false);
      clearInterval(intervalRef.current || undefined);
      saveToLocalStorage("blurAnalyses", { [message.hash]: false }, "add");
      handleUpdateRecord({ contentId, updateObject: message });
    },
    [contentId, intervalRef.current]
  );

  type HandleSelectProps = {
    blurType: BlurTypeEnum;
    contentCategory: string;
    contentId: string;
    intervalRef: any;
  };
  const handleSelect = useCallback(
    async ({ blurType, contentCategory, contentId, intervalRef }: HandleSelectProps) => {
      const relevantDisplayType = displayTypes.find((obj) => obj.value === blurType);
      if (!relevantDisplayType) return;

      setIsLoading(true);
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
              updateObject: response.message,
            });
            setIsLoading(false);
          } else if (hash) {
            saveToLocalStorage("blurAnalyses", { [hash]: false }, "add");
            intervalRef.current = setInterval(() => pollBlurProgressStatus(hash, blurType), 3000);
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error("Error in handleSelect: ", err);
      } finally {
        modals.closeAll();
      }
    },
    []
  );

  const items = useMemo(
    () =>
      displayTypes.map((item, i) => (
        <Checkbox
          key={i}
          checked={selectedDisplayType?.value === item.value}
          size="md"
          label={item.label}
          onChange={(e) => {
            e.stopPropagation();
            handleSelect({
              blurType: item.value as BlurTypeEnum,
              contentCategory,
              contentId,
              intervalRef,
            });
          }}
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

        setIsLoading(isLoading);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hash, blurType]);

  return (
    <Menu
      trigger="click"
      withinPortal={false}
      trapFocus={false}
      classNames={{ dropdown: classes.dropdown }}
    >
      <Menu.Target>
        <Group
          className={cn(classes.target, {
            [classes[position]]: true,
            [classes.relative]: isRelative,
          })}
          style={customStyles || {}}
        >
          <ActionIcon variant="default" loading={isLoading} disabled={isDisabled}>
            <IconBlur className="icon" />
          </ActionIcon>
          {progress > 0 && `${progress.toFixed(0)}%`}
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
