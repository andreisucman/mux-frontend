import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Loader, SimpleGrid, Stack, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import fetchClubTrackYou from "@/functions/fetchClubTrackYou";
import { ClubUserType } from "@/types/global";
import FollowYouRow from "../FollowYouRow";
import AllFollowersModalContent from "./AllFollowersModalContent";
import classes from "./FollowersList.module.css";

export default function FollowersList() {
  const { userDetails } = useContext(UserContext);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[]>();

  const { club } = userDetails || {};
  const { totalFollowers } = club || { totalFollowers: 0 };

  const initialRows = useMemo(
    () =>
      trackYouData &&
      trackYouData.slice(0, 10).map((item, index) => <FollowYouRow data={item} key={index} />),
    [trackYouData]
  );

  const handleFetchClubTrackYou = useCallback(async () => {
    try {
      const items = await fetchClubTrackYou();
      setTrackYouData(items);
    } catch (err) {
      console.log("Error in handleFetchClubTrackYou: ", err);
    }
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
    handleFetchClubTrackYou();
  }, []);

  return (
    <Stack className={classes.container}>
      {trackYouData ? (
        <>
          {trackYouData.length > 0 ? (
            <>
              <div className={classes.grid}>{initialRows}</div>
              {trackYouData.length > 10 && (
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
