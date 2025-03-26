import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IconBlur } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Checkbox, Group, Menu } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import callTheServer from "@/functions/callTheServer";
import { saveToLocalStorage } from "@/helpers/localStorage";
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
  { label: "Blurred", value: "blurred" },
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
  const [selectedDisplayType, setSelectedDisplayType] = useState<{
    label: string;
    value: string;
  }>();

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

  type HandleSelectProps = {
    blurType: BlurTypeEnum;
    contentCategory: string;
    contentId: string;
  };
  const handleSelect = useCallback(
    async ({ blurType, contentCategory, contentId }: HandleSelectProps) => {
      const relevantDisplayType = displayTypes.find((obj) => obj.value === blurType);
      if (!relevantDisplayType) return;

      setIsLoading(true);
      setSelectedDisplayType(relevantDisplayType);

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
            <IconBlur className="icon icon__small" />
          </ActionIcon>
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
