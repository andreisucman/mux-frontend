import React from "react";
import { usePathname } from "next/navigation";
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
  passwordError,
  handleEnterPassword,
}: Props) {
  const pathname = usePathname();
  const { score } = getPasswordStrength(password);

  const isSetPasswordPage = pathname === "/set-password";

  const checks = [
    ...requirements.map((requirement, index) => (
      <PasswordRequirement
        key={index}
        label={requirement.label}
        meets={requirement.re.test(password)}
      />
    )),
    <PasswordRequirement
      key={999}
      label={"Make it 6-18 characters"}
      meets={password.length >= 6 && password.length < 19}
    />,
  ];

  const bars = Array(4)
    .fill(0)
    .map((_, index) => {
      const color = score > 80 ? "green" : score > 50 ? "yellow" : "red";

      return (
        <Progress
          styles={{
            section: { transitionDuration: "0ms" },
            root: { position: "relative", zIndex: 1 },
          }}
          value={
            password.length > 0 && index === 0 ? 100 : score >= ((index + 1) / 4) * 100 ? 100 : 0
          }
          color={color}
          key={index}
          size={4}
        />
      );
    });

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
      {isSetPasswordPage && checks}
    </Stack>
  );
}
