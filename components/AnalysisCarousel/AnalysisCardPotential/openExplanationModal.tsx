import { rem, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import RingComponent from "@/components/RingComponent";

type Props = {
  values: { value: number; color: string; label: string }[];
  explanation: string;
};

export function openExplanationModal({ values, explanation }: Props) {
  const modelObject = values[0];
  modals.openContextModal({
    centered: true,
    modal: "general",
    title: (
      <Text fw={600} fz={rem(18)} lineClamp={1}>
        {upperFirst(modelObject.label)} potential
      </Text>
    ),
    innerProps: (
      <Stack>
        <RingComponent data={values} ringSize={150} isPotential={true} showTitle={false} />
        <Text>{explanation}</Text>
      </Stack>
    ),
  });
}
