import { rem, Stack, Text, Title } from "@mantine/core";
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
      <Title order={5} lineClamp={1}>
        {upperFirst(modelObject.label)} potential
      </Title>
    ),
    innerProps: (
      <Stack>
        <RingComponent data={values} ringSize={150} isPotential={true} showTitle={false} />
        <Text>{explanation}</Text>
      </Stack>
    ),
  });
}
