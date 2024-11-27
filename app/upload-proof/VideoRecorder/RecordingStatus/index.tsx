import { Group, Indicator } from "@mantine/core";
import useGetCountdown from "@/helpers/useGetCountdown";
import classes from "./RecordingStatus.module.css";

type Props = { recordingTime: number };

export default function RecordingStatus({ recordingTime }: Props) {
  const countdown = useGetCountdown({ recordingTime });

  return (
    <Group className={classes.container}>
      <Indicator size={16} className={classes.indicator} />
      <Group className={classes.time}>{countdown.seconds}</Group>
    </Group>
  );
}
