import React from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Stack, Text, Title } from "@mantine/core";
import classes from "./Disclaimer.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

export default function Disclaimer({ customStyles }: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Title order={4} className={classes.title}>
        <IconAlertTriangle className="icon" /> Disclaimer
      </Title>
      <Text className={classes.text}>
        The content of this website is for informational purposes only and is not intended as
        professional medical advice. It should not be used for diagnosing or treating any medical
        condition. Always seek the guidance of a qualified healthcare provider with any questions or
        concerns you may have regarding your health or medical care. Never disregard professional
        advice or delay seeking it because of something you see on this site.
      </Text>
    </Stack>
  );
}
