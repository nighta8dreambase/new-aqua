import React, { Fragment, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Box,
  Button,
  CardActionArea,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import classes from "*.module.css";
import { useReadUserByGender } from "../../services/api/dashboard_report/useReadUserByGender";
import { Bar } from "react-chartjs-2";
import { useReadUserByNationality } from "../../services/api/dashboard_report/useReadUserByNationality";
import { GRAPH_COLOR } from "../../data/graphColor";
import { useReadLengthOfStay } from "../../services/api/dashboard_report/useReadLengthOfStay";
import { CardTopValue } from "./Dashboard";

export const CardLengthOfStay = observer(() => {
  const { result_length_of_stay, loading_length_of_stay } = useReadLengthOfStay(
    webStore.latestTimeStamp
  );
  return (
    <Box css={{ borderRadius: 5, backgroundColor: "#fff" }}>
      {loading_length_of_stay && (
        <LinearProgress
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        />
      )}
      <Box p={2}>
        <Box mb={3}>
          <Typography>
            <Box fontWeight="bold">Length Of Stay</Box>
          </Typography>
        </Box>
        <Bar
          height={200}
          legend={{ position: "bottom", display: false }}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  gridLines: {
                    offsetGridLines: false,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    drawBorder: false,
                    display: false,
                  },
                  barThickness: 10,
                },
              ],
            },
          }}
          data={{
            datasets: [
              {
                data: (result_length_of_stay || []).map(({ y }) => y),
                // backgroundColor: GRAPH_COLOR,
                backgroundColor: "#4684E2",
              },
            ],
            labels: (result_length_of_stay || []).map(({ x }) => x),
          }}
        />
      </Box>
    </Box>
  );
});

export const CardTopLengthOfStay = observer(() => {
  const { result_length_of_stay, loading_length_of_stay } = useReadLengthOfStay(
    webStore.latestTimeStamp
  );
  let data = (result_length_of_stay || []).map(({ y }) => y);
  // let sum = data.reduce((a: any, b: any) => a + b, 0);
  let max = Math.max.apply(Math, data);
  let index = data.indexOf(Math.max(max));

  console.log("result_length_of_stay", result_length_of_stay);
  return (
    <CardTopValue
      title="Top length of stay"
      value={(result_length_of_stay || [])[index]?.x}
      total={`${max} days`}
    />
  );
});
