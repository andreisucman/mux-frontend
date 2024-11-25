import React from "react";
import { IconCircleCheck, IconHelpHexagon } from "@tabler/icons-react";
import { Avatar, Stack, Table, Text } from "@mantine/core";
import { SuggestionType } from "@/types/global";
import classes from "./TableSelection.module.css";

const CheckCell = ({ checked }: { checked: boolean }) => (
  <Stack>
    {checked ? (
      <IconCircleCheck className="icon icon__large" color="var(--mantine-color-green-7)" />
    ) : (
      <IconHelpHexagon className="icon icon__large" color="var(--mantine-color-gray-3)" />
    )}
  </Stack>
);

type Props = {
  suggestions: SuggestionType[];
  handleAlternativeClick: (suggestion: SuggestionType) => void;
};

export function TableSelection({ suggestions, handleAlternativeClick }: Props) {
  const modelSuggestion = suggestions[0];
  const checkKeys = Object.keys(modelSuggestion.analysisResult);

  const rows = checkKeys.map((key, index) => {
    return (
      <Table.Tr className={classes.row} key={index}>
        <Table.Td className={classes.keyCell}>
          <Text className={classes.keyText}>{key}</Text>
        </Table.Td>
        {suggestions.map((suggestion, index) => (
          <Table.Td className={classes.keyCell} key={index}>
            <CheckCell checked={suggestion.analysisResult[key]} />
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

  const headings = (
    <Table.Tr className={classes.row}>
      <Table.Th className={classes.headingCell}>
        <Text fw={600}>Feature analysis</Text>
      </Table.Th>
      {suggestions.map((suggestion, index) => {
        return (
          <Table.Th
            className={classes.headingCell}
            key={index}
            onClick={() => handleAlternativeClick(suggestion)}
          >
            <Stack gap="sm" className={classes.avatarWrapper}>
              <Avatar size={42} src={suggestion.image} radius={42} />
            </Stack>
          </Table.Th>
        );
      })}
    </Table.Tr>
  );

  return (
    <Stack className={classes.container}>
      <Table verticalSpacing="sm">
        <Table.Thead>{headings}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}
