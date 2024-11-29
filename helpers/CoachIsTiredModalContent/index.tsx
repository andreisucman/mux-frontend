import { Image, Stack, Text } from "@mantine/core";
import EnergyIndicator from "@/app/advisor/chat/EnergyIndicator";
import coachRestingFemale from "@/public/assets/coach_is_tired_female.svg";
import coachRestingMale from "@/public/assets/coach_is_tired_male.svg";
import { SexEnum } from "@/types/global";
import classes from "./CoachIsTiredModalContent.module.css";

type Props = {
  sex: SexEnum;
  value: number;
};

export default function CoachIsTiredModalContent({ value, sex }: Props) {
  const image = sex === "male" ? coachRestingMale.src : coachRestingFemale.src;

  return (
    <Stack className={classes.container}>
      <Stack className={classes.imageWrapper}>
        <Image src={image} className={classes.image} />
      </Stack>

      <Stack className={classes.content}>
        <Text className={classes.text}>
          {`You've tired your coach out and ${sex === "male" ? "he" : "she"} is
            resting.`}
        </Text>
        <EnergyIndicator value={value} />
        <Text className={classes.text} c="dimmed">
          You can ask more questions later as {sex === "male" ? "his" : "her"} energy grows.
        </Text>
      </Stack>
    </Stack>
  );
}
