import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button, Collapse, Group, rem, Stack, Text, Title } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
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
  const [showCollapsedInfo, setShowCollapsedInfo] = useState(false);

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
    <IconChevronUp className="icon" />
  ) : (
    <IconChevronDown className="icon" />
  );

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      {showCollapsedInfo && (
        <AvatarComponent avatar={avatar} customStyles={{ maxWidth: rem(48) }} />
      )}

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

        {intro && (
          <Collapse in={showCollapsedInfo}>
            {!isMini && (
              <Text size="sm" lineClamp={5} mr={8}>
                {intro}{" "}
              </Text>
            )}
            {socials?.length > 0 && <SocialsDisplayLine socials={socials} />}
          </Collapse>
        )}
      </Stack>

      {showButton && (
        <Button
          variant={"default"}
          size={showCollapsedInfo ? "sm" : "compact-sm"}
          className={classes.button}
          onClick={() => router.push("/club/publish-routines")}
        >
          Publish routines
        </Button>
      )}
    </Group>
  );
}

export default memo(ClubProfilePreview);
