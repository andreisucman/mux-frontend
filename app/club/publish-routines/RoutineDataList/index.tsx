import React, { useCallback } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { PartEnum } from "@/types/global";
import { RoutineDataType } from "../page";
import RoutineDataRow from "../RoutineDataRow";
import classes from "./RoutineDataList.module.css";

type Props = {
  routineDataRecords: RoutineDataType[];
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  changeStatus: (
    part: PartEnum,
    concern: string,
    newStatus: "public" | "hidden",
    oldStatus: "public" | "hidden",
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  changeMonetization: (
    part: PartEnum,
    concern: string,
    newMonetization: "enabled" | "disabled",
    oldMonetization: "enabled" | "disabled",
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  fetchRoutineData: (
    hasMore: boolean,
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
};

export default function RoutineDataList({
  hasMore,
  routineDataRecords,
  setHasMore,
  changeStatus,
  changeMonetization,
  fetchRoutineData,
}: Props) {
  const memoizedDataRow = useCallback((props: any) => {
    const data = props.data;

    return (
      <RoutineDataRow
        defaultRoutine={data}
        changeMonetization={(
          newMonetization: "enabled" | "disabled",
          isLoading: any,
          setIsLoading: any
        ) =>
          changeMonetization(
            data.part,
            data.concern,
            newMonetization,
            data.monetization,
            isLoading,
            setIsLoading
          )
        }
        changeStatus={(newStatus: "public" | "hidden", isLoading: any, setIsLoading: any) =>
          changeStatus(
            data.part,
            data.concern,
            newStatus,
            data.status as "public" | "hidden",
            isLoading,
            setIsLoading
          )
        }
      />
    );
  }, []);

  return (
    <Stack className={classes.container}>
      {routineDataRecords ? (
        <>
          {routineDataRecords.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader
                    m="0 auto"
                    pt="20%"
                    color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                  />
                </Stack>
              }
              loadMore={() => fetchRoutineData(hasMore, setHasMore)}
              useWindow={false}
              hasMore={hasMore}
              pageStart={0}
            >
              <Masonry
                items={routineDataRecords}
                maxColumnCount={2}
                columnGutter={16}
                rowGutter={16}
                render={memoizedDataRow}
              />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="Nobody found" icon={<IconCircleOff size={20} />} />
          )}
        </>
      ) : (
        <Stack flex={1}>
          <Loader
            m="0 auto"
            pt="20%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        </Stack>
      )}
    </Stack>
  );
}
