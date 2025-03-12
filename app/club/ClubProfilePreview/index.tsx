import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconChevronUp, IconTrendingUp } from "@tabler/icons-react";
import { Button, Collapse, Group, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
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
  showCollapseKey: string;
  customStyles?: { [key: string]: any };
};

function ClubProfilePreview({
  type,
  data,
  isMini,
  showCollapseKey,
  showButton,
  customStyles,
}: Props) {
  const router = useRouter();
  const { latestScoresDifference, bio, name, avatar } = data || {};
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

  const rowStyle: { [key: string]: any } = {};

  const redirectToAbout = useCallback(() => {
    if (!data) return;

    let url = `/club/${name}`;

    router.push(url);
  }, [name]);

  const handleToggleCollapse = () => {
    setShowCollapsedInfo((prev) => {
      saveToIndexedDb(`showUserProfileInfo-${showCollapseKey}`, !prev);
      return !prev;
    });
  };

  useEffect(() => {
    getFromIndexedDb(`showUserProfileInfo-${showCollapseKey}`).then((verdict) => {
      if (verdict !== false) verdict = true;
      setShowCollapsedInfo(verdict);
    });
  }, [showCollapseKey]);

  const chevron = showCollapsedInfo ? (
    <IconChevronUp className="icon" style={{ marginLeft: rem(4) }} />
  ) : (
    <IconChevronDown className="icon" style={{ marginLeft: rem(4) }} />
  );

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      {showCollapsedInfo && (
        <Stack gap={rem(4)}>
          <AvatarComponent avatar={avatar} />
          {!isMini && (
            <Text size="xs" c="dimmed" ta="center">
              {upperFirst(type)}
            </Text>
          )}
        </Stack>
      )}

      <Stack className={classes.content}>
        <Group align="center" gap={8}>
          <Title order={4} className={classes.name} lineClamp={2} onClick={handleToggleCollapse}>
            {chevron} {name}{" "}
          </Title>
          {!showCollapsedInfo && type === "you" && (
            <Text size="xs" fw={"normal"} c="dimmed">
              (You)
            </Text>
          )}
        </Group>

        <Collapse in={showCollapsedInfo}>
          {!isMini && (
            <Text size="sm" lineClamp={5} mb={2}>
              {bio?.intro}
            </Text>
          )}
          {bio && bio.socials.length > 0 && <SocialsDisplayLine socials={bio.socials} />}
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
          onClick={redirectToAbout}
        >
          Manage routines
        </Button>
      )}
    </Group>
  );
}

export default memo(ClubProfilePreview);
