import React from 'react'
import { Chart } from 'react-charts'

export default function Graph() {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 3]]
      },
      {
        label: 'Series 2',
        data: [[2, 3], [3, 2], [4, 1]]
      },
      {
        label: 'Series 3',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  )

  const series = React.useMemo(
    () => ({
      type: 'area'
    }),
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} series={series} axes={axes} tooltip />
    </div>
  )
}
