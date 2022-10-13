import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Flex } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = ["December", "January", "February", "March", "April"];

const data = {
  labels,
  datasets: [
    {
      label: "MBUC /$",
      data: [0.68, 0.84, 0.74, 0.7, 1.12],
      borderColor: "rgb(41, 75, 245)",
      backgroundColor: "rgba(41, 75, 245, 0.2)",
      fill: true,
      tension: 0.1,
    },
  ],
};
const options = {
  responsive: true,
  maintainAspectRatio: true,
  datasetFill: true,
  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value: any, index: any, ticks: any) {
          return "$" + value.toFixed(2);
        },
      },
    },
  },

  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItems: any) {
          return "1 MBUC = " + "$" + tooltipItems.formattedValue;
        },
      },
    },
  },
};

const GraphMBUC = () => {
  return (
    <Flex align="center" justify="center" w="100%">
      <Line width={300} height="100%" options={options} data={data} redraw />
    </Flex>
  );
};

export default GraphMBUC;
