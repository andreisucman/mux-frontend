import React, { useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Button, Loader, Stack } from "@mantine/core";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import getFilters from "@/functions/getFilters";

type Props = {
  onClick: (part: string) => void;
};

export default function SelectBodyPart({ onClick }: Props) {
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();

  useEffect(() => {
    getFilters({
      collection: "concern",
      fields: ["parts"],
    }).then((result) => {
      console.log("result.parts", result.parts);
      setAvailableParts(result.parts.filter((p) => !["face", "hair"].includes(p.value)));
    });
  }, []);

  return (
    <Stack>
      {availableParts ? (
        <>
          {availableParts.length > 0 ? (
            <>
              {availableParts.map((part, i) => (
                <Button variant="default" w="100%" key={i} onClick={() => onClick(part.value)}>
                  {part.label}
                </Button>
              ))}
            </>
          ) : (
            <OverlayWithText text="Nothing found" icon={<IconCircleOff size={18} />} />
          )}
        </>
      ) : (
        <Stack mih={200} m="auto" justify="center">
          <Loader style={{ transform: "translateY(-50%)" }} />
        </Stack>
      )}
    </Stack>
  );
}
