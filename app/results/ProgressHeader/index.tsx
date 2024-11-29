import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconDental,
  IconMan,
  IconMoodNeutral,
  IconMoodSmile,
  IconWhirl,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import modifyQuery from "@/helpers/modifyQuery";
import TitleDropdown from "../TitleDropdown";
import { PositionsFilterItemType } from "./types";
import classes from "./ProgressHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

const partsData = [
  { label: "Face", icon: <IconMoodNeutral className="icon" />, value: "face", type: "head" },
  { label: "Mouth", icon: <IconDental className="icon" />, value: "mouth", type: "head" },
  { label: "Scalp", icon: <IconWhirl className="icon" />, value: "scalp", type: "head" },
];

const positionsData = [
  { label: "Front", value: "front", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Right", value: "right", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Left", value: "left", types: ["head", "body"], parts: ["face", "body"] },
];

const titles = [
  { label: "Progress", value: "/results" },
  { label: "Style", value: "/results/style" },
  { label: "Proof", value: "/results/proof" },
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
  const pathname = usePathname();

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

    const relPositions = positionsData.filter(
      (p) => p.types.includes(type) && p.parts.includes(part)
    );
    setRelevantPositions(relPositions);

    const params = [];

    if (relParts.length === 0) {
      params.push({ name: "part", value: null, action: "delete" });
      params.push({ name: "position", value: null, action: "delete" });
    }

    if (relPositions.length === 0) {
      params.push({ name: "position", value: null, action: "delete" });
    }

    if (params.length > 0) {
      const newQuery = modifyQuery({ params });
      router.replace(`${pathname}?${newQuery}`);
    }
  }, [type, part, partsData, positionsData]);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
      </Group>
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
  );
}
