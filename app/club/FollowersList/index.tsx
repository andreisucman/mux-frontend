import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Loader, Stack, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import fetchFollowYou from "@/functions/fetchFollowYou";
import { ClubUserType } from "@/types/global";
import FollowYouRow from "../FollowYouRow";
import AllFollowersModalContent from "./AllFollowersModalContent";
import classes from "./FollowersList.module.css";

export default function FollowersList() {
  const { status, userDetails } = useContext(UserContext);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[]>();

  const { club } = userDetails || {};
  const { totalFollowers } = club || { totalFollowers: 0 };

  const initialRows = useMemo(
    () =>
      trackYouData &&
      trackYouData.slice(0, 20).map((item, index) => <FollowYouRow data={item} key={index} />),
    [trackYouData]
  );

  const handleFetchClubTrackYou = useCallback(async () => {
    try {
      const items = await fetchFollowYou();
      setTrackYouData(items);
    } catch (err) {}
  }, []);

  const openAllFollowersModal = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      title: (
        <Title order={5} component={"p"}>
          All followers
        </Title>
      ),
      innerProps: <AllFollowersModalContent />,
    });
  }, []);

  useEffect(() => {
    if (status !== AuthStateEnum.AUTHENTICATED) return;
    handleFetchClubTrackYou();
  }, [status]);

  return (
    <Stack className={classes.container}>
      {trackYouData ? (
        <>
          {trackYouData.length > 0 ? (
            <>
              <div className={classes.grid}>{initialRows}</div>
              {trackYouData.length > 20 && (
                <UnstyledButton
                  c="dimmed"
                  className={classes.showAllButton}
                  onClick={openAllFollowersModal}
                >
                  Show all {totalFollowers} followers
                </UnstyledButton>
              )}
            </>
          ) : (
            <OverlayWithText text="Nobody found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Loader style={{ margin: "auto" }} />
      )}
    </Stack>
  );
}
