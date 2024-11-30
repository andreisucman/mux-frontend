import CalorieResultOverlay from ".";
import { IconRotate } from "@tabler/icons-react";
import { Button, rem } from "@mantine/core";

export default {
  title: "Calorie Result Overlay",
};

const props = {
  data: {
    shouldEat: false,
    energy: 1300,
    proteins: 52,
    carbohydrates: 21,
    fats: 3,
    explanation: "It'll make you fat.",
  },
  calorieGoal: 2500,
  goalType: "portion" as "portion",
  handleClose: () => {},
  actionChildren: (
    <Button variant="default" w="100%">
      <IconRotate className="icon" style={{ marginRight: rem(8) }} /> New scan
    </Button>
  ),
};

export const CalorieResultOverlayDemo = () => <CalorieResultOverlay {...props} />;
