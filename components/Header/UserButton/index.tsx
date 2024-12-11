import { IconRotateDot, IconSettings, IconSocial } from "@tabler/icons-react";
import { Avatar, Menu, rem, UnstyledButton } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import { IconScanFood, IconScanStyle } from "@/components/customIcons";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./UserButton.module.css";

type Props = {
  avatar?: { [key: string]: any };
  clubPayouts?: { detailsSubmitted: boolean; payoutsEnabled: boolean; disabledReason: string };
};

function UserButton({ avatar, clubPayouts }: Props) {
  const { detailsSubmitted, disabledReason } = clubPayouts || {};

  const clubUrl = disabledReason ? "/club/admission" : "/club";
  const clubText = disabledReason ? "Club admission" : "Club profile";

  return (
    <Menu withArrow classNames={{ itemLabel: classes.itemLabel }}>
      <Menu.Target>
        <UnstyledButton>
          {avatar ? (
            <AvatarComponent
              avatar={avatar}
              customStyles={{
                marginTop: rem(1),
                height: rem(35),
                width: rem(36),
                minHeight: rem(35),
                minWidth: rem(36),
              }}
            />
          ) : (
            <Avatar size={36} />
          )}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/routines">
          <IconRotateDot className="icon icon__small" style={{ marginRight: rem(6) }} /> My routines
        </Menu.Item>
        <Menu.Item component={Link} href="/scan/food">
          <IconScanStyle className={`icon ${classes.icon}`} style={{ marginRight: rem(6) }} />
          Scan food
        </Menu.Item>
        <Menu.Item component={Link} href="/scan/style">
          <IconScanFood className={`icon ${classes.icon}`} style={{ marginRight: rem(6) }} />
          Scan style
        </Menu.Item>
        {detailsSubmitted && (
          <Menu.Item component={Link} href={clubUrl}>
            <IconSocial className="icon icon__small" style={{ marginRight: rem(6) }} /> {clubText}
          </Menu.Item>
        )}
        <Menu.Item component={Link} href="/settings">
          <IconSettings className="icon icon__small" style={{ marginRight: rem(6) }} /> Settings
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButton;
