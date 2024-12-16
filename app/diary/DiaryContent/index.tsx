import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconNote } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Skeleton, Stack, Title } from "@mantine/core";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
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
  isLoading?: boolean;
  openValue: string | null;
  setOpenValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleFetchDiaryRecords: () => void;
};

export default function DiaryContent({
  hasMore,
  diaryRecords,
  isLoading,
  openValue,
  setOpenValue,
  handleFetchDiaryRecords,
}: Props) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const memoizedDiaryRow = useCallback(
    (props: any) => {
      const formattedDate = useMemo(() => formatDate({ date: props.data.createdAt }), []);
      return (
        <Accordion.Item value={props.data._id}>
          <Accordion.Control>
            <Title order={5} className={classes.title}>
              <IconNote className={`${classes.icon} icon`} /> {formattedDate}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <DiaryRow data={props.data} index={props.index} type={type as TypeEnum} />
          </Accordion.Panel>
        </Accordion.Item>
      );
    },
    [type, isLoading, diaryRecords]
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
            <List
              items={diaryRecords}
              rowGutter={16}
              render={memoizedDiaryRow}
              className={classes.list}
            />
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
