"use client";

import React from "react";
import Image from "next/image";
import { Cell, Pie, PieChart } from "recharts";
import { Stack } from "@mantine/core";
import { upperFirst, useElementSize } from "@mantine/hooks";
import plate from "@/public/assets/empty-plate.svg";
import classes from "./PieChart.module.css";

type Props = {
  data: { name: string; value: number }[];
};

type RenderCustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  name: string;
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  name,
}: RenderCustomizedLabelProps) => {
  if (value === 0) return;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + (radius / 2) * Math.cos(-midAngle * RADIAN * 1.5);
  const y = cy + (radius / 2) * Math.sin(-midAngle * RADIAN);

  return (
    <text
      className={classes.label}
      x={x}
      y={y}
      fill="white"
      textAnchor={"middle"}
      dominantBaseline="central"
    >
      {upperFirst(name)} {value}%
    </text>
  );
};

export default function PieChartComponent({ data }: Props) {
  const COLORS = ["#2bdd66", "#f21616"];
  const { ref, height } = useElementSize();

  return (
    <Stack className={classes.container} ref={ref}>
      <PieChart width={height * 0.9} height={height * 0.9}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          fill="transparent"
          dataKey="value"
          opacity={0.5}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={""} />
          ))}
        </Pie>
      </PieChart>
      <Image
        src={plate.src}
        className={classes.image}
        width={height * 0.9}
        height={height * 0.9}
        alt=""
      />
    </Stack>
  );
}
