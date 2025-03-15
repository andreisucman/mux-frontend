import React, { useState } from "react";
import { Accordion, Group, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import DeleteContentButton from "@/components/DeleteContentButton";
import { getPartIcon } from "@/helpers/icons";
import DiaryRow from "../DiaryRow";
import { DiaryRecordType } from "../../app/diary/type";
import classes from "./DiaryAccordionItem.module.css";

type Props = {
  data: DiaryRecordType;
  formattedDate: string;
  timeZone: string;
  index: number;
  setDiaryRecords?: React.Dispatch<React.SetStateAction<DiaryRecordType[] | undefined>>;
};

export default function DiaryAccordionItem({
  data,
  formattedDate,
  timeZone,
  index,
  setDiaryRecords,
}: Props) {
  const { _id: recordId, part } = data;
  const [isLoading, setIsLoading] = useState(false);

  const icon = getPartIcon(part || "");
  const label = upperFirst(part || "");

  return (
    <Accordion.Item value={recordId || ""}>
      <Accordion.Control component={"div"}>
        <Group className={classes.container}>
          <Title order={5} className={classes.title}>
            {icon} {label} note - {formattedDate}
          </Title>
          <DeleteContentButton
            collectionKey="diary"
            contentId={recordId || ""}
            isLoading={isLoading}
            isDisabled={isLoading}
            setContent={setDiaryRecords}
            setIsLoading={setIsLoading}
            isRelative
          />
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <DiaryRow data={data} index={index} timeZone={timeZone} />
      </Accordion.Panel>
    </Accordion.Item>
  );
}
