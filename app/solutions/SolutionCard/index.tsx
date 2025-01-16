import React, { useState } from "react";
import { IconChevronDown, IconScan } from "@tabler/icons-react";
import {
  Button,
  Collapse,
  Group,
  rem,
  RingProgress,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ExampleContainer from "@/components/ExampleContainer";
import ExplanationContainer from "@/components/ExplanationContainer";
import SuggestionContainer from "@/components/SuggestionContainer";
import Link from "@/helpers/custom-router/patch-router/link";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { SolutionCardType } from "../types";
import classes from "./SolutionCard.module.css";

type Props = { data: SolutionCardType };

export default function SolutionCard({ data }: Props) {
  const [opened, { toggle: toggleCollapse }] = useDisclosure(true);
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);

  const { icon, color, name, instruction, description, example, suggestions, key } = data;

  const sections = [
    {
      value: 0,
      color: "gray.3",
    },
  ];

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Stack className={classes.container}>
        <Group className={classes.heading} style={{ backgroundColor: color }}>
          {icon}
          <Title order={2} className={classes.solutionName}>
            {name}
          </Title>
        </Group>
        <Stack className={classes.content}>
          <Group className={classes.ringWrapper}>
            <Text>{description}</Text>
            <RingProgress
              size={100}
              thickness={10}
              mr={rem(8)}
              label={<Text className={classes.ringProgressLabelText}>0%</Text>}
              className={classes.ringProgress}
              classNames={{ label: classes.ringProgressLabel }}
              sections={sections}
            />
          </Group>
          <Stack className={classes.exampleWrapper}>
            {example && <ExampleContainer title="Example" example={example} />}
            <ExplanationContainer
              title={"Instruction:"}
              text={instruction}
              customStyles={example ? { borderRadius: "0 0 1rem 1rem" } : {}}
            />
          </Stack>

          <Stack className={classes.ctaBox}>
            <Text className={classes.ctaText}>Get your improvement routine</Text>
            <Button component={Link} variant="default" href={"/scan"}>
              <IconScan style={{ marginRight: rem(6) }} />
              Scan now
            </Button>
          </Stack>
          {suggestions && suggestions.length > 0 && (
            <Stack gap={16}>
              <Group className={classes.showProductsHeading} onClick={toggleCollapse}>
                <IconChevronDown
                  style={
                    opened
                      ? {
                          transform: "rotate(180deg)",
                        }
                      : {
                          transform: "rotate(0deg)",
                        }
                  }
                />
                <Text size="sm">See recommended products</Text>
              </Group>
              <Collapse in={opened}>
                <SuggestionContainer
                  chatContentId={data.key}
                  taskKey={data.key}
                  items={suggestions}
                  customStyles={{ backgroundColor: "transparent", padding: 0 }}
                  rowStyles={{ marginLeft: 0 }}
                  selectedAsins={selectedAsins}
                  setSelectedAsins={setSelectedAsins}
                />
              </Collapse>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Skeleton>
  );
}
