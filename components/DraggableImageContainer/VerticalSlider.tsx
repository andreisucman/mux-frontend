import React, { memo } from "react";
import { Group } from "@mantine/core";
import { useMove } from "@mantine/hooks";

type Props = {
  value: number;
  setValue: (args: any) => void;
};

function VerticalSlier({ value, setValue }: Props) {
  const { ref } = useMove(({ y }) => setValue(1 - y));

  return (
    <Group justify="center">
      <div
        //@ts-ignore
        ref={ref}
        style={{
          width: 16,
          height: 120,
          backgroundColor: "light-dark(var(--mantine-color-gray-4),var(--mantine-color-dark-4))",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            height: `${value * 100}%`,
            width: 16,
            backgroundColor: "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))",
            opacity: 0.7,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: `calc(${value * 100}% - 1rem)`,
            left: 0,
            width: 16,
            height: 16,
            backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-3))",
          }}
        />
      </div>
    </Group>
  );
}

export default memo(VerticalSlier);
