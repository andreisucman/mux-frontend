import { IconRotateDot, IconScan, IconSettings, IconSocial } from "@tabler/icons-react";
import { Menu, rem, UnstyledButton } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./UserButton.module.css";

type Props = { avatar?: { [key: string]: any }; clubDetailsSubmitted: boolean };

function UserButton({ avatar, clubDetailsSubmitted }: Props) {
  return (
    <Menu withArrow classNames={{ itemLabel: classes.itemLabel }}>
      <Menu.Target>
        <UnstyledButton>
          <AvatarComponent
            avatar={avatar}
            customStyles={{
              height: rem(36),
              width: rem(36),
              minHeight: rem(36),
              minWidth: rem(36),
            }}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/scan">
          <IconScan className="icon icon__small" style={{ marginRight: rem(8) }} /> Scan
        </Menu.Item>
        <Menu.Item component={Link} href="/routines">
          <IconRotateDot className="icon icon__small" style={{ marginRight: rem(8) }} /> My routines
        </Menu.Item>
        {clubDetailsSubmitted && (
          <Menu.Item component={Link} href="/club">
            <IconSocial className="icon icon__small" style={{ marginRight: rem(8) }} /> My club page
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
