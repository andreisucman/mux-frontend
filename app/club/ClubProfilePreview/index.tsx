import React, { memo, useCallback } from "react";
import { IconMan, IconMoodSmile, IconSettings } from "@tabler/icons-react";
import { ActionIcon, Group, rem, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import { useRouter } from "@/helpers/custom-router";
import Link from "@/helpers/custom-router/patch-router/link";
import { ClubUserType } from "@/types/global";
import MenuButtons from "./MenuButtons";
import SocialsDisplayLine from "./SocialsDisplayLine";
import classes from "./ClubProfilePreview.module.css";

type Props = {
  type: "you" | "user";
  isMini?: boolean;
  data?: ClubUserType | null;
  showButtons?: boolean;
  customStyles?: { [key: string]: any };
};

function ClubProfilePreview({ type, data, isMini, showButtons, customStyles }: Props) {
  const router = useRouter();
  const { scores, bio, _id: followingUserId, name, avatar } = data || {};
  const { headTotalProgress, bodyTotalProgress } = scores || {};
  const { questions } = bio || {};

  const progessExists = headTotalProgress !== undefined || bodyTotalProgress !== undefined;
  const rowStyle: { [key: string]: any } = {};

  const hasQuestions = questions && questions.length > 0;

  const redirectToProgress = useCallback(() => {
    if (!data) return;

    let url = `/club/progress?id=${followingUserId}`;

    if (!!headTotalProgress) {
      url += `&type=head`;
    } else if (!!bodyTotalProgress) {
      url += `&type=body`;
    }
    router.push(url);
  }, [headTotalProgress, bodyTotalProgress, followingUserId]);

  const redirectToTrackingAbout = useCallback(() => {
    if (!data) return;

    router.push(`/club/about?id=${followingUserId}`);
  }, [followingUserId]);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Group className={classes.row} style={rowStyle}>
        <Stack gap={rem(4)}>
          <AvatarComponent avatar={avatar} />
          {!isMini && (
            <Text size="xs" c="dimmed" ta="center">
              {upperFirst(type)}
            </Text>
          )}
        </Stack>

        <Stack className={classes.content}>
          <Title order={4} className={classes.name} lineClamp={2}>
            {name}
          </Title>

          {!isMini && (
            <Text size="sm" lineClamp={5}>
              {bio?.intro}
            </Text>
          )}
          {bio && bio.socials.length > 0 && <SocialsDisplayLine socials={bio.socials} />}
          {progessExists && (
            <Group wrap="nowrap">
              {headTotalProgress !== undefined && (
                <ScoreCell
                  icon={<IconMoodSmile className="icon" />}
                  score={Math.max(headTotalProgress, 0)}
                />
              )}
              {bodyTotalProgress !== undefined && (
                <ScoreCell
                  icon={<IconMan className="icon" />}
                  score={Math.max(bodyTotalProgress, 0)}
                />
              )}
            </Group>
          )}
        </Stack>
        {type === "you" && (
          <ActionIcon
            variant="default"
            size="sm"
            component={Link}
            href="/settings"
            className={classes.clubSettingsButton}
          >
            <IconSettings className="icon icon__small" />
          </ActionIcon>
        )}
      </Group>
      {showButtons && (
        <MenuButtons
          type={type}
          hasQuestions={!!hasQuestions}
          redirectToProgress={redirectToProgress}
          redirectToTrackingAbout={redirectToTrackingAbout}
        />
      )}
    </Stack>
  );
}

export default memo(ClubProfilePreview);
