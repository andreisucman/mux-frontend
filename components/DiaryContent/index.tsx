import React, { useCallback, useContext, useMemo } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon } from "@mantine/core";
import SelectPartOrConcern from "@/app/club/routines/[[...userName]]/SelectPartOrConcern";
import { DiaryType } from "@/app/diary/type";
import ListComponent from "@/components/ListComponent";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import DiaryAccordionItem from "../DiaryAccordionItem";
import { FilterItemType } from "../FilterDropdown/types";
import OverlayWithText from "../OverlayWithText";
import classes from "./DiaryContent.module.css";

type Props = {
  hasMore: boolean;
  diaryRecords?: DiaryType[];
  availableConcerns?: FilterItemType[];
  availableParts?: FilterItemType[];
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
  availableConcerns,
  availableParts,
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
            rowGutter={12}
            render={memoizedDiaryRow}
            className={classes.list}
          />
        ) : (
          <>
            {isPublic ? (
              <SelectPartOrConcern
                partFilterItems={availableParts || []}
                concernFilterItems={availableConcerns || []}
              />
            ) : (
              <OverlayWithText icon={<IconCircleOff size={18} />} text="Nothing found" />
            )}
          </>
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
