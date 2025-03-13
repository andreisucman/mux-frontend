import React, { useCallback, useMemo } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack } from "@mantine/core";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { formatDate } from "@/helpers/formatDate";
import DiaryAccordionItem from "../DiaryAccordionItem";
import { DiaryRecordType } from "../type";
import classes from "./DiaryContent.module.css";

type Props = {
  hasMore: boolean;
  diaryRecords?: DiaryRecordType[];
  timeZone?: string;
  openValue: string | null;
  setDiaryRecords?: React.Dispatch<React.SetStateAction<DiaryRecordType[] | undefined>>;
  setOpenValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleFetchDiaryRecords: () => void;
};

export default function DiaryContent({
  hasMore,
  diaryRecords,
  openValue,
  timeZone,
  setDiaryRecords,
  setOpenValue,
  handleFetchDiaryRecords,
}: Props) {
  const memoizedDiaryRow = useCallback(
    (props: any) => {
      const formattedDate = useMemo(() => formatDate({ date: props.data.createdAt }), []);
      return (
        <DiaryAccordionItem
          data={props.data}
          index={props.index}
          timeZone={timeZone || ""}
          setDiaryRecords={setDiaryRecords}
          formattedDate={formattedDate}
        />
      );
    },
    [diaryRecords]
  );

  return (
    <Stack className={classes.content}>
      {diaryRecords ? (
        <>
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
            {diaryRecords.length > 0 ? (
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
      ) : (
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </Stack>
  );
}
