import React, { memo, useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconChevronUp, IconTrendingUp } from "@tabler/icons-react";
import { Button, Collapse, Group, rem, Stack, Text, Title } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import { useRouter } from "@/helpers/custom-router";
import { getPartIcon } from "@/helpers/icons";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { ClubUserType } from "@/types/global";
import SocialsDisplayLine from "./SocialsDisplayLine";
import classes from "./ClubProfilePreview.module.css";

type Props = {
  type: "you" | "member";
  isMini?: boolean;
  data?: ClubUserType | null;
  showButton?: boolean;
  customStyles?: { [key: string]: any };
};

function ClubProfilePreview({ type, data, isMini, showButton, customStyles }: Props) {
  const router = useRouter();
  const { name, intro, avatar, socials, latestScoresDifference } = data || { socials: [] };
  const { overall } = latestScoresDifference || {};
  const [showCollapsedInfo, setShowCollapsedInfo] = useState(false);

  const nonZeroParts = useMemo(
    () =>
      Object.entries(latestScoresDifference || {})
        .filter(([key, value]) => typeof value === "number")
        .map(([key, overall]) => {
          const icon = getPartIcon(key, "icon__small");
          return { icon, score: overall };
        }),
    [latestScoresDifference]
  );

  const handleToggleCollapse = () => {
    setShowCollapsedInfo((prev) => {
      saveToIndexedDb(`showUserProfileInfo`, !prev);
      return !prev;
    });
  };

  useEffect(() => {
    getFromIndexedDb(`showUserProfileInfo`).then((verdict) => {
      if (verdict !== false) verdict = true;
      setShowCollapsedInfo(verdict);
    });
  }, []);

  const chevron = showCollapsedInfo ? (
    <IconChevronUp className="icon" style={{ marginLeft: rem(4) }} />
  ) : (
    <IconChevronDown className="icon" style={{ marginLeft: rem(4) }} />
  );

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      {showCollapsedInfo && <AvatarComponent avatar={avatar} />}

      <Stack className={classes.content}>
        <Group align="center" gap={8}>
          <Title order={4} className={classes.name} lineClamp={2} onClick={handleToggleCollapse}>
            {chevron} {name}{" "}
          </Title>
          {type === "you" && (
            <Text size="xs" fw={"normal"} c="dimmed">
              (You)
            </Text>
          )}
        </Group>

        <Collapse in={showCollapsedInfo}>
          {!isMini && (
            <Text size="sm" lineClamp={5} mb={2}>
              {intro}
            </Text>
          )}
          {socials?.length > 0 && <SocialsDisplayLine socials={socials} />}
          {overall && overall > 0 ? (
            <>
              <ScoreCell score={overall} icon={<IconTrendingUp className="icon icon__small" />} />
              {nonZeroParts.map((obj, i) => (
                <ScoreCell key={i} score={obj.score as number} icon={obj.icon} />
              ))}
            </>
          ) : (
            <></>
          )}
        </Collapse>
      </Stack>

      {showButton && (
        <Button
          variant={"default"}
          size={showCollapsedInfo ? "sm" : "compact-sm"}
          className={classes.button}
          onClick={() => router.push("/club/manage-routines")}
        >
          Manage routines
        </Button>
      )}
    </Group>
  );
}

export default memo(ClubProfilePreview);
