import { IconRotateDot, IconScan, IconSettings, IconSocial } from "@tabler/icons-react";
import { Avatar, Menu, rem, UnstyledButton } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./UserButton.module.css";

type Props = { avatar?: { [key: string]: any }; clubDetailsSubmitted: boolean };

function UserButton({ avatar, clubDetailsSubmitted }: Props) {
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
          <IconRotateDot className="icon icon__small" style={{ marginRight: rem(8) }} /> My routines
        </Menu.Item>
        {clubDetailsSubmitted && (
          <Menu.Item component={Link} href="/club">
            <IconSocial className="icon icon__small" style={{ marginRight: rem(8) }} /> Club profile
          </Menu.Item>
        )}
        <Menu.Item component={Link} href="/settings">
          <IconSettings className="icon icon__small" style={{ marginRight: rem(8) }} /> Settings
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButton;
