import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconDental,
  IconMan,
  IconMoodSmile,
  IconWhirl,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { useRouter } from "@/helpers/custom-router";
import { PositionsFilterItemType } from "./types";
import classes from "./ProgressHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

const partsData = [
  { label: "Face", icon: <IconMoodSmile className="icon" />, value: "face", type: "head" },
  { label: "Mouth", icon: <IconDental className="icon" />, value: "mouth", type: "head" },
  { label: "Scalp", icon: <IconWhirl className="icon" />, value: "scalp", type: "head" },
];

const positionsData = [
  { label: "Front", value: "front", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Right", value: "right", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Left", value: "left", types: ["head", "body"], parts: ["face", "body"] },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

export default function ProgressHeader({ title, showReturn, isDisabled, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part") || "face";
  const position = searchParams.get("position") || "front";

  const [relevantParts, setRelevantParts] = useState(partsData.filter((p) => p.type === type));
  const [relevantPositions, setRelevantPositions] = useState<PositionsFilterItemType[]>(
    positionsData.filter((p) => p.types.includes(type) && p.parts.includes(part))
  );

  useEffect(() => {
    const relParts = partsData.filter((p) => p.type === type);
    setRelevantParts(relParts);
  }, [type]);

  useEffect(() => {
    const relPositions = positionsData.filter(
      (p) => p.types.includes(type) && p.parts.includes(part)
    );
    setRelevantPositions(relPositions);
  }, [type, part]);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={2}>
          {title}
        </Title>
      </Group>
      <Group className={classes.right}>
        <FilterDropdown
          data={typeData}
          filterType="type"
          defaultSelected={typeData.find((item) => item.value === type)}
          onSelect={onSelect}
          isDisabled={isDisabled}
          addToQuery
        />
        {relevantParts.length > 0 && (
          <FilterDropdown
            data={relevantParts}
            filterType="part"
            defaultSelected={relevantParts.find((item) => item.value === part)}
            onSelect={onSelect}
            isDisabled={isDisabled}
            addToQuery
          />
        )}
        {relevantPositions.length > 0 && (
          <FilterDropdown
            data={relevantPositions}
            filterType="position"
            defaultSelected={relevantPositions.find((item) => item.value === position)}
            onSelect={onSelect}
            isDisabled={isDisabled}
            addToQuery
          />
        )}
      </Group>
    </Group>
  );
}
