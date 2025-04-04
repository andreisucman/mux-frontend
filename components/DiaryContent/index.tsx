import React, { useCallback, useContext, useMemo } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Stack } from "@mantine/core";
import { DiaryRecordType } from "@/app/diary/type";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import DiaryAccordionItem from "../DiaryAccordionItem";
import classes from "./DiaryContent.module.css";

type Props = {
  hasMore: boolean;
  diaryRecords?: DiaryRecordType[];
  openValue: string | null;
  setDiaryRecords?: React.Dispatch<React.SetStateAction<DiaryRecordType[] | undefined>>;
  setOpenValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleFetchDiaryRecords: () => void;
};

export default function DiaryContent({
  hasMore,
  diaryRecords,
  openValue,
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
          setDiaryRecords={setDiaryRecords}
          formattedDate={formattedDate}
        />
      );
    },
    [diaryRecords, userId]
  );

  return (
    <Stack className={classes.container}>
      <Accordion
        value={openValue}
        onChange={setOpenValue}
        className={classes.accordion}
        classNames={{
          root: `${classes.root} scrollbar`,
          item: classes.item,
          control: classes.control,
          content: classes.accordionContent,
          chevron: classes.chevron,
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
    </Stack>
  );
}
