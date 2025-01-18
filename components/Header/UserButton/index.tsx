import {
  IconDoorExit,
  IconRotateDot,
  IconScan,
  IconSettings,
  IconSocial,
} from "@tabler/icons-react";
import { Avatar, Menu, rem, UnstyledButton } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./UserButton.module.css";

type Props = {
  avatar: { [key: string]: any } | null;
  name?: string;
  handleSignOut: () => void;
};

function UserButton({ avatar = null, name, handleSignOut }: Props) {
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
        {name && (
          <Menu.Item component={Link} href="/club" style={{ paddingBottom: rem(4) }}>
            <IconSocial className={`icon icon__small`} style={{ marginRight: rem(6) }} />{" "}
            <strong>{name}</strong>
          </Menu.Item>
        )}
        <Menu.Item component={Link} href="/tasks">
          <IconRotateDot className="icon icon__small" style={{ marginRight: rem(6) }} /> My tasks
        </Menu.Item>
        <Menu.Item component={Link} href="/scan">
          <IconScan className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          Scan
        </Menu.Item>
        <Menu.Item component={Link} href="/settings">
          <IconSettings className="icon icon__small" style={{ marginRight: rem(6) }} /> Settings
        </Menu.Item>
        <Menu.Item onClick={handleSignOut}>
          <IconDoorExit className="icon icon__small" style={{ marginRight: rem(6) }} /> Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButton;
