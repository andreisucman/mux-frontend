import React, { useState } from "react";
import { Accordion, Group, Title } from "@mantine/core";
import DeleteContentButton from "@/components/DeleteContentButton";
import { getPartIcon } from "@/helpers/icons";
import { normalizeString } from "@/helpers/utils";
import { DiaryType } from "../../app/diary/type";
import DiaryRow from "../DiaryRow";
import classes from "./DiaryAccordionItem.module.css";

type Props = {
  data: DiaryType;
  formattedDate: string;
  isPublic: boolean;
  index: number;
  isSelf: boolean;
  setDiaryRecords?: React.Dispatch<React.SetStateAction<DiaryType[] | undefined>>;
};

export default function DiaryAccordionItem({
  data,
  formattedDate,
  index,
  isSelf,
  isPublic,
  setDiaryRecords,
}: Props) {
  const { _id: recordId, part, concern } = data;
  const [isLoading, setIsLoading] = useState(false);

  const icon = getPartIcon(part || "");
  const label = normalizeString(concern || "");

  return (
    <Accordion.Item value={recordId || "no_value"}>
      <Accordion.Control component={"div"}>
        <Group className={classes.container}>
          <Title order={5} className={classes.title}>
            {icon} {label} - {formattedDate}
          </Title>
          {isSelf && (
            <DeleteContentButton
              collectionKey="diary"
              contentId={recordId || ""}
              isLoading={isLoading}
              isDisabled={isLoading}
              setContent={setDiaryRecords}
              setIsLoading={setIsLoading}
              isRelative
            />
          )}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <DiaryRow data={data} isPublic={!!isPublic} index={index} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
