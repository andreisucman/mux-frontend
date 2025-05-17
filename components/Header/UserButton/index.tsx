import {
  IconDoorExit,
  IconListDetails,
  IconScan,
  IconSettings,
  IconSocial,
} from "@tabler/icons-react";
import { Avatar, Menu, rem, UnstyledButton } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import Link from "@/helpers/custom-router/patch-router/link";
import { AvatarType } from "@/types/global";
import classes from "./UserButton.module.css";

type Props = {
  isClubActive: boolean;
  avatar?: AvatarType | null;
  handleSignOut: () => void;
};

function UserButton({ isClubActive, avatar, handleSignOut }: Props) {
  return (
    <Menu withArrow classNames={{ itemLabel: classes.itemLabel }}>
      <Menu.Target>
        <UnstyledButton>
          {isClubActive ? (
            <AvatarComponent
              avatar={avatar}
              customStyles={{
                minHeight: rem(36),
                minWidth: rem(36),
              }}
            />
          ) : (
            <Avatar size={36} />
          )}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {isClubActive && (
          <Menu.Item component={Link} href="/club" style={{ paddingBottom: rem(4) }}>
            <IconSocial size={16} style={{ marginRight: rem(6) }} />
            My club
          </Menu.Item>
        )}
        <Menu.Item component={Link} href="/tasks">
          <IconListDetails size={16} style={{ marginRight: rem(6) }} /> My tasks
        </Menu.Item>
        <Menu.Item component={Link} href="/select-part">
          <IconScan size={16} style={{ marginRight: rem(6) }} />
          Scan
        </Menu.Item>
        <Menu.Item component={Link} href="/settings">
          <IconSettings size={16} style={{ marginRight: rem(6) }} /> Settings
        </Menu.Item>
        <Menu.Item onClick={handleSignOut}>
          <IconDoorExit size={16} style={{ marginRight: rem(6) }} /> Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButton;
