import React from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Center, Text } from "@mantine/core";

type Props = { meets: boolean; label: string };

function PasswordRequirement({ meets, label }: Props) {
  return (
    <Text
      component="div"
      c={meets ? "teal" : "red"}
      size="sm"
      mt={6}
    >
      <Center inline>
        {meets ? (
          <IconCheck className="icon icon__small" />
        ) : (
          <IconX className="icon icon__small" />
        )}
        <Text component="span" ml={8}>
          {label}
        </Text>
      </Center>
    </Text>
  );
}

export default PasswordRequirement;
