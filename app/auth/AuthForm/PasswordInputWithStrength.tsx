import React from "react";
import { Group, PasswordInput, Progress, Stack } from "@mantine/core";
import getPasswordStrength, { requirements } from "@/helpers/getPasswordStrength";
import PasswordRequirement from "./PasswordRequirement";

type Props = {
  password: string;
  withChecks?: boolean;
  passwordError: string;
  handleEnterPassword: (e: React.FormEvent<HTMLInputElement>) => void;
};

export default function PasswordInputWithStrength({
  password,
  withChecks,
  passwordError,
  handleEnterPassword,
}: Props) {
  const { score } = getPasswordStrength(password);

  const checks = [
    ...requirements.map((requirement, index) => (
      <PasswordRequirement
        key={index}
        label={requirement.label}
        meets={requirement.re.test(password)}
      />
    )),
    <PasswordRequirement
      label={"Make it 6-18 characters"}
      meets={password.length >= 6 && password.length < 19}
    />,
  ];

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: "0ms" } }}
        value={
          password.length > 0 && index === 0 ? 100 : score >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={score > 80 ? "teal" : score > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  return (
    <Stack gap={8}>
      <PasswordInput
        value={password}
        onChange={handleEnterPassword}
        placeholder={"Create a strong password"}
        error={passwordError}
        required
      />
      <Group gap={6} grow mt="xs" mb={2}>
        {bars}
      </Group>
      {withChecks && checks}
    </Stack>
  );
}
