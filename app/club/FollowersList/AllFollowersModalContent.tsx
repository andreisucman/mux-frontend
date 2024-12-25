import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { List } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import fetchFollowYou from "@/functions/fetchFollowYou";
import { ClubUserType } from "@/types/global";
import FollowYouRow from "../FollowYouRow";

export default function AllFollowersModalContent() {
  const [hasMore, setHasMore] = useState(false);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[]>();

  const handleFetchClubTrackYou = useCallback(async (skip: boolean, existingCount?: number) => {
    const items = await fetchFollowYou({ skip, existingCount });

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
              <List items={trackYouData} rowGutter={16} render={FollowYouRow} />
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
