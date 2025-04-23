import React, { useCallback, useContext, useMemo } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Stack } from "@mantine/core";
import { DiaryType } from "@/app/diary/type";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import DiaryAccordionItem from "../DiaryAccordionItem";
import classes from "./DiaryContent.module.css";

type Props = {
  hasMore: boolean;
  diaryRecords?: DiaryType[];
  openValue: string | null;
  isPublic?: boolean;
  setDiaryRecords?: React.Dispatch<React.SetStateAction<DiaryType[] | undefined>>;
  setOpenValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleFetchDiaryRecords: () => void;
};

export default function DiaryContent({
  hasMore,
  diaryRecords,
  openValue,
  isPublic,
  setDiaryRecords,
  setOpenValue,
  handleFetchDiaryRecords,
}: Props) {
  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  const memoizedDiaryRow = useCallback(
    (props: any) => {
      const formattedDate = useMemo(() => formatDate({ date: props.data.createdAt }), []);
      const isSelf = userId === props.data.userId;
      return (
        <DiaryAccordionItem
          data={props.data}
          index={props.index}
          isSelf={isSelf}
          isPublic={!!isPublic}
          setDiaryRecords={setDiaryRecords}
          formattedDate={formattedDate}
        />
      );
    },
    [diaryRecords, userId, isPublic]
  );

  return (
    <>
      <Accordion
        value={openValue}
        onChange={setOpenValue}
        classNames={{
          root: `accordionRoot scrollbar ${classes.accordion}`,
          content: "accordionContent",
          chevron: "accordionChevron",
          item: "accordionItem",
          control: "accordionControl",
        }}
      >
        {diaryRecords && diaryRecords.length > 0 ? (
          <ListComponent
            items={diaryRecords}
            rowGutter={16}
            render={memoizedDiaryRow}
            className={classes.list}
          />
        ) : (
          <OverlayWithText text={`Nothing found`} icon={<IconCircleOff className="icon" />} />
        )}
      </Accordion>
      {hasMore && (
        <ActionIcon
          variant="default"
          className={classes.getMoreButton}
          onClick={handleFetchDiaryRecords}
        >
          <IconArrowDown />
        </ActionIcon>
      )}
    </>
  );
}
