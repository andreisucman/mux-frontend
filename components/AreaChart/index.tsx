import { memo } from "react";
import {
  Area,
  AreaChart,
  Label,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import classes from "./AreaChart.module.css";

const data = [
  { name: "0", Points: 0 },
  { name: "1", Points: 0 },
  { name: "2", Points: 0 },
  { name: "3", Points: 0 },
  { name: "4", Points: 0 },
  { name: "5", Points: 0 },
  { name: "6", Points: 0 },
  { name: "7", Points: 0 },
  { name: "8", Points: 0 },
  { name: "9", Points: 0 },
  { name: "10", Points: 1 },
  { name: "11", Points: 1 },
  { name: "12", Points: 1 },
  { name: "13", Points: 2 },
  { name: "14", Points: 2 },
  { name: "15", Points: 3 },
  { name: "16", Points: 4 },
  { name: "17", Points: 5 },
  { name: "18", Points: 6 },
  { name: "19", Points: 7 },
  { name: "20", Points: 9 },
  { name: "21", Points: 11 },
  { name: "22", Points: 13 },
  { name: "23", Points: 15 },
  { name: "24", Points: 18 },
  { name: "25", Points: 21 },
  { name: "26", Points: 24 },
  { name: "27", Points: 27 },
  { name: "28", Points: 30 },
  { name: "29", Points: 34 },
  { name: "30", Points: 38 },
  { name: "31", Points: 42 },
  { name: "32", Points: 46 },
  { name: "33", Points: 50 },
  { name: "34", Points: 54 },
  { name: "35", Points: 58 },
  { name: "36", Points: 62 },
  { name: "37", Points: 66 },
  { name: "38", Points: 70 },
  { name: "39", Points: 74 },
  { name: "40", Points: 78 },
  { name: "41", Points: 82 },
  { name: "42", Points: 85 },
  { name: "43", Points: 88 },
  { name: "44", Points: 91 },
  { name: "45", Points: 94 },
  { name: "46", Points: 96 },
  { name: "47", Points: 98 },
  { name: "48", Points: 99 },
  { name: "49", Points: 100 },
  { name: "50", Points: 100 },
  { name: "51", Points: 99 },
  { name: "52", Points: 98 },
  { name: "53", Points: 96 },
  { name: "54", Points: 94 },
  { name: "55", Points: 91 },
  { name: "56", Points: 88 },
  { name: "57", Points: 85 },
  { name: "58", Points: 82 },
  { name: "59", Points: 78 },
  { name: "60", Points: 74 },
  { name: "61", Points: 70 },
  { name: "62", Points: 66 },
  { name: "63", Points: 62 },
  { name: "64", Points: 58 },
  { name: "65", Points: 54 },
  { name: "66", Points: 50 },
  { name: "67", Points: 46 },
  { name: "68", Points: 42 },
  { name: "69", Points: 38 },
  { name: "70", Points: 34 },
  { name: "71", Points: 30 },
  { name: "72", Points: 27 },
  { name: "73", Points: 24 },
  { name: "74", Points: 21 },
  { name: "75", Points: 18 },
  { name: "76", Points: 15 },
  { name: "77", Points: 13 },
  { name: "78", Points: 11 },
  { name: "79", Points: 9 },
  { name: "80", Points: 7 },
  { name: "81", Points: 6 },
  { name: "82", Points: 5 },
  { name: "83", Points: 4 },
  { name: "84", Points: 3 },
  { name: "85", Points: 2 },
  { name: "86", Points: 2 },
  { name: "87", Points: 1 },
  { name: "88", Points: 1 },
  { name: "89", Points: 1 },
  { name: "90", Points: 0 },
  { name: "91", Points: 0 },
  { name: "92", Points: 0 },
  { name: "93", Points: 0 },
  { name: "94", Points: 0 },
  { name: "95", Points: 0 },
  { name: "96", Points: 0 },
  { name: "97", Points: 0 },
  { name: "98", Points: 0 },
  { name: "99", Points: 0 },
  { name: "100", Points: 0 },
];

type Props = {
  hideLabel?: boolean;
  isCurrent?: boolean;
  referenceLineValue: number | null;
};

function AreaChartComponent({ referenceLineValue, isCurrent }: Props) {
  // Override console.error
  // This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
  // @link https://github.com/recharts/recharts/issues/3615
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  const color = "var(--mantine-color-red-7)";

  const { ref, width } = useElementSize();
  const smileSize = width * 0.07;

  return (
    <Stack className={classes.container} ref={ref}>
      <ResponsiveContainer className={classes.responsive} width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorChart" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#656a7e" stopOpacity={0.8} />
              <stop offset="65%" stopColor="#585e72" stopOpacity={0} />
              <stop offset="100%" stopColor="#4a5167" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="Points"
            stroke="#a9adb9"
            fill="url(#colorChart)"
            strokeWidth={3}
          />
          <ReferenceLine
            isFront={true}
            x={Math.round(referenceLineValue || 0)}
            stroke={color}
            label={
              <Label
                value={isCurrent ? "Current" : "Goal"}
                fontSize="16"
                position={"insideBottomRight"}
                fill={color}
                fontWeight="Bold"
                offset={15}
                angle={45}
              />
            }
            alwaysShow={true}
            strokeWidth={3}
          />

          <ReferenceArea
            strokeWidth={0}
            isFront={false}
            ifOverflow="hidden"
            x1={0}
            x2={50}
            fill="var(--mantine-color-yellow-7)"
            fillOpacity=".05"
            label={
              <Label
                fontSize={20 > smileSize ? 20 : smileSize}
                position={"top"}
                offset={-30}
                fill="var(--mantine-color-yellow-7)"
                fontWeight="Bold"
              />
            }
          />
          <ReferenceArea
            strokeWidth={0}
            isFront={false}
            ifOverflow="hidden"
            x1={50}
            x2={100}
            fill="var(--mantine-color-green-7)"
            fillOpacity=".05"
            label={
              <Label
                fontSize={20 > smileSize ? 20 : smileSize}
                position={"top"}
                offset={-30}
                fill="var(--mantine-color-green-7)"
                fontWeight="Bold"
              />
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
}

export default memo(AreaChartComponent);
