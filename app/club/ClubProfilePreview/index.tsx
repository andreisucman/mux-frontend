import React, { memo, useCallback, useEffect, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSettings,
  IconTrendingUp,
} from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Collapse, Group, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import AvatarComponent from "@/components/AvatarComponent";
import { useRouter } from "@/helpers/custom-router";
import Link from "@/helpers/custom-router/patch-router/link";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { ClubUserType } from "@/types/global";
import MenuButtons from "./MenuButtons";
import SocialsDisplayLine from "./SocialsDisplayLine";
import classes from "./ClubProfilePreview.module.css";

type Props = {
  type: "you" | "member";
  isMini?: boolean;
  data?: ClubUserType | null;
  hasNewAboutQuestions?: boolean;
  showButtons?: boolean;
  showCollapseKey: string;
  customStyles?: { [key: string]: any };
};

function ClubProfilePreview({
  type,
  data,
  isMini,
  showCollapseKey,
  showButtons,
  hasNewAboutQuestions,
  customStyles,
}: Props) {
  const router = useRouter();
  const { scores, bio, name, avatar } = data || {};
  const { totalProgress } = scores || {};
  const [showCollapsedInfo, setShowCollapsedInfo] = useState(true);

  const rowStyle: { [key: string]: any } = {};

  const redirectToProgress = useCallback(() => {
    if (!data) return;

    let url = `/club/progress/${name}`;

    router.push(url);
  }, [name]);

  const redirectToTrackingAbout = useCallback(() => {
    if (!data) return;

    router.push(`/club/${name}`);
  }, [name]);

  const handleToggleCollapse = () => {
    setShowCollapsedInfo((prev) => {
      saveToIndexedDb(`showUserProfileInfo-${showCollapseKey}`, !prev);
      return !prev;
    });
  };

  useEffect(() => {
    getFromIndexedDb(`showUserProfileInfo-${showCollapseKey}`).then((verdict) => {
      if (verdict === undefined || verdict === null) verdict = true;
      setShowCollapsedInfo(verdict);
    });
  }, [showCollapseKey]);

  const chevron = showCollapsedInfo ? (
    <IconChevronUp className="icon" style={{ marginLeft: rem(4) }} />
  ) : (
    <IconChevronDown className="icon" style={{ marginLeft: rem(4) }} />
  );

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Group className={classes.row} style={rowStyle}>
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
          <Title order={4} className={classes.name} lineClamp={2} onClick={handleToggleCollapse}>
            <Group align="center" gap={4}>
              {chevron} {name}
            </Group>
          </Title>
          <Collapse in={showCollapsedInfo}>
            {!isMini && (
              <Text size="sm" lineClamp={5} mb={2}>
                {bio?.intro}
              </Text>
            )}
            {bio && bio.socials.length > 0 && <SocialsDisplayLine socials={bio.socials} />}
            {totalProgress !== undefined && (
              <Group align="center" gap={8}>
                <IconTrendingUp className="icon" />
                {String(totalProgress)}
              </Group>
            )}
          </Collapse>
        </Stack>
        {type === "you" && (
          <ActionIcon
            variant="default"
            size="md"
            component={Link}
            href="/settings"
            className={cn(classes.clubSettingsButton, { [classes.relative]: !showCollapsedInfo })}
          >
            <IconSettings className="icon" />
          </ActionIcon>
        )}
      </Group>
      {showButtons && showCollapsedInfo && (
        <MenuButtons
          type={type}
          hasQuestions={!!hasNewAboutQuestions}
          redirectToProgress={redirectToProgress}
          redirectToTrackingAbout={redirectToTrackingAbout}
        />
      )}
    </Stack>
  );
}

export default memo(ClubProfilePreview);
