import React, { useCallback, useContext, useState } from "react";
import { IconChevronDown, IconChevronUp, IconCirclePlus } from "@tabler/icons-react";
import { ActionIcon, Collapse, Divider, Group, Stack, Text, TextInput } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { validateUrl } from "@/helpers/utils";
import { UserDataType } from "@/types/global";
import SocialLink from "./SocialLink";
import classes from "./AddClubSocials.module.css";

type Props = {
  title?: string;
};

export default function AddClubSocials({ title }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [openAddSocial, setOpenAddSocial] = useState(false);
  const [nameError, setNameError] = useState("");
  const [adressError, setAddressError] = useState("");

  const { club } = userDetails || {};
  const { socials } = club || { socials: [] };

  const addSocial = useCallback(
    async ({ label, value }: { label: string; value: string }) => {
      if (!value) {
        setAddressError("Address can't be empty");
        return;
      }

      if (!name) {
        setNameError("Name can't be empty");
        return;
      }

      const isValidUrl = validateUrl(value);

      if (!isValidUrl) {
        setAddressError("Invalid URL");
        return;
      }

      const newSocials = [socials, { label, value }];

      setUserDetails((prev: UserDataType) => ({
        ...(prev || {}),
        club: { ...(prev.club || {}), socials: newSocials },
      }));

      setName("");
      setValue("");

      updateSocials(newSocials);
    },
    [socials]
  );

  const deleteSocial = useCallback(
    (value: string | null) => {
      if (!value || !socials) return;

      const newSocials = socials.map((rec) => (rec.value === value ? null : rec)).filter(Boolean);

      setUserDetails((prev: UserDataType) => ({
        ...(prev || {}),
        club: { ...(prev.club || {}), socials: newSocials },
      }));

      updateSocials(newSocials);
    },
    [socials]
  );

  const updateSocials = useCallback(async (newSocials: { [key: string]: any }) => {
    try {
      await callTheServer({
        endpoint: "updateUserData",
        method: "POST",
        body: {
          socials: newSocials,
        },
      });
    } catch (err) {
      openErrorModal();
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        addSocial({ label: name, value });
      }
    },
    [name, value]
  );

  const chevron = openAddSocial ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  const addSocialText = openAddSocial ? "Hide" : "Show more";

  return (
    <Stack className={classes.container}>
      {title && (
        <Text size="sm" c="dimmed">
          {title}
        </Text>
      )}
      <Stack className={classes.addGroup}>
        <TextInput
          value={name}
          placeholder="Title"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            if (nameError) setNameError("");
            setName(e.currentTarget.value);
          }}
        />
        <Group className={classes.valueGroup}>
          <TextInput
            flex={1}
            value={value}
            error={adressError}
            placeholder="https://..."
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (adressError) setAddressError("");
              setValue(e.currentTarget.value);
            }}
            onKeyDown={onKeyDown}
          />
          <ActionIcon
            disabled={value.trim().length === 0}
            onClick={() => addSocial({ label: name, value: value.toLowerCase() })}
          >
            <IconCirclePlus className="icon" />
          </ActionIcon>
        </Group>
      </Stack>
      {socials.slice(0, 2).map((item) => (
        <SocialLink key={item.value} {...item} deleteSocial={deleteSocial} />
      ))}
      {socials.length > 2 && (
        <>
          <Divider
            label={
              <Group gap={8}>
                {chevron} {addSocialText}
              </Group>
            }
            onClick={() => setOpenAddSocial((prev) => !prev)}
          />
          <Collapse in={openAddSocial}>
            {socials.slice(2).map((item) => (
              <SocialLink key={item.value} {...item} deleteSocial={deleteSocial} />
            ))}
          </Collapse>
        </>
      )}
    </Stack>
  );
}
