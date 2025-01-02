import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff, IconNote } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Skeleton, Stack, Title } from "@mantine/core";
import DeleteContentButton from "@/components/DeleteContentButton";
import OverlayWithText from "@/components/OverlayWithText";
import { formatDate } from "@/helpers/formatDate";
import { TypeEnum } from "@/types/global";
import DiaryRow from "../DiaryRow";
import { DiaryRecordType } from "../type";
import classes from "./DiaryContent.module.css";

const List = dynamic(() => import("masonic").then((mod) => mod.List), {
  ssr: false,
  loading: () => <Skeleton className="skeleton" visible></Skeleton>,
});

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
  setOpenValue,
  handleFetchDiaryRecords,
  setDiaryRecords,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  const memoizedDiaryRow = useCallback(
    (props: any) => {
      const formattedDate = useMemo(() => formatDate({ date: props.data.createdAt }), []);
      return (
        <Accordion.Item value={props.data._id || null}>
          <Accordion.Control>
            <DeleteContentButton
              collectionKey="diary"
              contentId={props.data._id}
              isLoading={isLoading}
              isDisabled={isLoading}
              setContent={setDiaryRecords}
              setIsLoading={setIsLoading}
              isRelative
            />
            <Title order={5} className={classes.title}>
              <IconNote className={`${classes.icon} icon`} /> {formattedDate}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <DiaryRow
              data={props.data}
              index={props.index}
              type={type as TypeEnum}
              timeZone={timeZone}
            />
          </Accordion.Panel>
        </Accordion.Item>
      );
    },
    [type, diaryRecords]
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
              root: classes.root,
              item: classes.item,
              control: classes.control,
              content: classes.accordionContent,
            }}
          >
            {diaryRecords.length > 0 ? (
              <List
                items={diaryRecords}
                rowGutter={16}
                render={memoizedDiaryRow}
                className={classes.list}
              />
            ) : (
              <OverlayWithText
                text={`No diary records${type ? ` for ${type}` : ""}`}
                icon={<IconCircleOff className="icon" />}
              />
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
