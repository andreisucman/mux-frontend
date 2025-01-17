import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { IconArrowDown, IconCircleOff, IconNote } from "@tabler/icons-react";
import { Accordion, ActionIcon, Group, Loader, Skeleton, Stack, Title } from "@mantine/core";
import DeleteContentButton from "@/components/DeleteContentButton";
import OverlayWithText from "@/components/OverlayWithText";
import { formatDate } from "@/helpers/formatDate";
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

  const memoizedDiaryRow = useCallback(
    (props: any) => {
      const formattedDate = useMemo(() => formatDate({ date: props.data.createdAt }), []);
      return (
        <Accordion.Item value={props.data._id || null}>
          <Accordion.Control component={"div"}>
            <Group>
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
                <IconNote className={`${classes.icon} icon`} /> {formattedDate} note
              </Title>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <DiaryRow
              data={props.data}
              index={props.index}
              timeZone={timeZone}
            />
          </Accordion.Panel>
        </Accordion.Item>
      );
    },
    [ diaryRecords]
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
