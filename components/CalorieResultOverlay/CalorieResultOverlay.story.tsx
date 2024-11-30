import CalorieResultOverlay from ".";
import { IconRotate } from "@tabler/icons-react";
import { Button, rem } from "@mantine/core";

export default {
  title: "Calorie Result Overlay",
};

const props = {
  data: {
    calories: 1300,
    protein: 52,
    carbohydrates: 21,
    fats: 3,
  },
  calorieGoal: 2500,
  goalType: "portion" as "portion",
  actionButtons: (
    <Button variant="default">
      <IconRotate className="icon" style={{ marginRight: rem(8) }} /> New scan
    </Button>
  ),
};

export const CalorieResultOverlayDemo = () => <CalorieResultOverlay {...props} />;
