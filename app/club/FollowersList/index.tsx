import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { ClubUserType } from "@/types/global";
import FollowYouRow from "../FollowYouRow";
import classes from "./FollowersList.module.css";

export default function FollowersList() {
  const { status } = useContext(UserContext);
  const [hasMore, setHasMore] = useState(false);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[]>();

  const getClubTrackYou = useCallback(async (skip?: boolean, existingCount?: number) => {
    try {
      let endpoint = "getClubTrackYou";
      if (skip && existingCount) {
        endpoint += `?skip=${existingCount}`;
      }
      const response = await callTheServer({
        endpoint,
        method: "GET",
      });

      if (response.status === 200) {
        if (skip) {
          setTrackYouData([...(trackYouData || []), ...response.message.slice(0, 20)]);
        } else {
          setTrackYouData(response.message.slice(0, 20));
        }
        setHasMore(response.message.length === 21);
      } else {
        openErrorModal();
      }
    } catch (err) {
      console.log("Error in getClubTrackYou: ", err);
    }
  }, []);

  useEffect(() => {
    getClubTrackYou();
  }, [status]);

  return (
    <Stack className={classes.container}>
      {trackYouData ? (
        <>
          {trackYouData.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
                </Stack>
              }
              loadMore={() => getClubTrackYou(hasMore, trackYouData && trackYouData.length)}
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
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </Stack>
  );
}
