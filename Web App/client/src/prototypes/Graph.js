import React from "react";
import { Chart } from "react-charts";

export default function Graph() {
  const data = React.useMemo(
    () => [
      {
        label: "Nama Mata Pelajaran",
        data: [
          [1, 2],
          [2, 3],
        ],
      },
    ],
    []
  );

  const series = React.useMemo(
    () => ({
      type: "bar",
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: "1000px",
        height: "300px",
      }}
    >
      <Chart data={data} series={series} axes={axes} tooltip />
    </div>
  );
}
