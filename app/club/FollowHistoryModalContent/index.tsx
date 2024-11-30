import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { List } from "masonic";
import { ActionIcon, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { ClubDataType, UserDataType } from "@/types/global";
import FollowHistoryModalCard from "./FollowHistoryModalCard";
import classes from "./FollowHistoryModalContent.module.css";

type FollowType = {
  avatar: { [key: string]: any };
  name: string;
  trackedUserId: string;
};

type HandleFetchFollowHistoryProps = {
  skip?: boolean;
  history?: FollowType[];
};

export default function FollowHistoryModalContent() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [history, setHistory] = useState<FollowType[]>();
  const [hasMore, setHasMore] = useState(false);

  const handleTrackUser = useCallback(async (userId: string) => {
    try {
      const response = await callTheServer({
        endpoint: "trackUser",
        method: "POST",
        body: { trackedUserId: userId },
      });

      if (response.status === 200) {
        const { club } = userDetails || {};
        const newClub = { ...club, trackedUserId: userId };

        if (club) {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: newClub as ClubDataType,
          }));
        }

        const query = modifyQuery({
          params: [{ name: "trackedUserId", value: userId, action: "replace" }],
        });
        router.push(`/club?${query}`);
        modals.closeAll();
      }
    } catch (err) {
      console.log("Error in handleTrackUser follow: ", err);
    }
  }, []);

  const handleFetchFollowHistory = async ({ skip, history }: HandleFetchFollowHistoryProps) => {
    try {
      let endpoint = "getFollowHistory";
      if (skip && history) {
        endpoint += `?skip=${history.length}`;
      }
      const response = await callTheServer({ endpoint, method: "GET" });
      if (response.status === 200) {
        if (skip) {
          setHistory([...(history || []), ...response.message.slice(0, 6)]);
        } else {
          setHistory(response.message.slice(0, 6));
        }
        setHasMore(response.message.length === 7);
      }
    } catch (err) {
      console.log("Error in handleFetchFollowHistory: ", err);
    }
  };

  const memoizedHistoryCard = useCallback(
    (props: any) => (
      <FollowHistoryModalCard key={props.index} data={props.data} onClick={handleTrackUser} />
    ),
    []
  );

  useEffect(() => {
    handleFetchFollowHistory({ skip: hasMore, history });
  }, []);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        {history ? (
          <>
            {history.length > 0 ? (
              <List
                items={history}
                className={classes.list}
                rowGutter={16}
                render={memoizedHistoryCard}
              />
            ) : (
              <OverlayWithText text="No history found" icon={<IconCircleOff className="icon" />} />
            )}
          </>
        ) : (
          <Loader m="auto" />
        )}
      </Stack>
      {hasMore && (
        <ActionIcon
          variant="default"
          className={classes.getMoreButton}
          onClick={() =>
            handleFetchFollowHistory({
              skip: true,
              history,
            })
          }
        >
          <IconArrowDown />
        </ActionIcon>
      )}
    </Stack>
  );
}
