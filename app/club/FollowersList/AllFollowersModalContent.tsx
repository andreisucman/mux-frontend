import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import fetchClubTrackYou from "@/functions/fetchClubTrackYou";
import { ClubUserType } from "@/types/global";
import FollowYouRow from "../FollowYouRow";

export default function AllFollowersModalContent() {
  const [hasMore, setHasMore] = useState(false);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[]>();

  const handleFetchClubTrackYou = useCallback(async (skip: boolean, existingCount?: number) => {
    const items = await fetchClubTrackYou({ skip, existingCount });

    if (skip) {
      setTrackYouData([...(trackYouData || []), ...items.slice(0, 10)]);
    } else {
      setTrackYouData(items.slice(0, 10));
    }
    setHasMore(items.length === 11);
  }, []);

  useEffect(() => {
    handleFetchClubTrackYou(false, 0);
  }, []);

  return (
    <>
      {trackYouData ? (
        <>
          {trackYouData.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
                </Stack>
              }
              loadMore={() => handleFetchClubTrackYou(hasMore, trackYouData && trackYouData.length)}
              useWindow={false}
              hasMore={hasMore}
              pageStart={0}
            >
              <MasonryComponent
                maxColumnCount={3}
                columnWidth={250}
                columnGutter={16}
                render={FollowYouRow}
                items={trackYouData}
              />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="Nobody found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Stack flex={1}>
          <Loader style={{ margin: "auto" }} />
        </Stack>
      )}
    </>
  );
}
