import React, { Fragment, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Box,
  Button,
  CardActionArea,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import classes from "*.module.css";
import { useReadUserByGender } from "../../services/api/dashboard_report/useReadUserByGender";
import { Doughnut, Bar } from "react-chartjs-2";
import { useReadUserByNationality } from "../../services/api/dashboard_report/useReadUserByNationality";
import { GRAPH_COLOR } from "../../data/graphColor";
import { useReadUserByAge } from "../../services/api/dashboard_report/useReadUserByAge";
import { CardTopValue } from "./Dashboard";

export const CardAge = observer(() => {
  const { result_user_by_age, loading_user_by_age } = useReadUserByAge(
    webStore.latestTimeStamp
  );
  return (
    <Box
      css={{
        borderRadius: 5,
        backgroundColor: "#fff",
        display: "flex",
        flex: 1,
        minHeight: "100%",
        flexFlow: "column",
      }}
    >
      {loading_user_by_age && (
        <LinearProgress
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        />
      )}
      <Box
        style={{
          width: "100%",
          flex: 1,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        p={2}
      >
        <Typography gutterBottom style={{ marginBottom: "1rem" }}>
          <Box fontWeight="bold"> People by age </Box>
        </Typography>
        <div
          style={{
            minHeight: 200,
            flex: "1",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Bar
            height={180}
            legend={{ position: "bottom", display: false }}
            options={{
              barRoundness: 0.3,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: false,
                      // beginAtZero: true,
                      stepSize: 5,
                      min: 0,
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
              legend: {
                labels: {
                  boxWidth: 5,
                },
                position: "bottom",
              },
            }}
            data={{
              datasets: [
                {
                  data: (result_user_by_age || []).map(({ value }) => value),
                  backgroundColor: "#4684E2",
                  // backgroundColor: GRAPH_COLOR,
                },
              ],
              labels: (result_user_by_age || []).map(({ title }) => title),
            }}
          />
        </div>
      </Box>
    </Box>
  );
});

export const CardTopAge = observer(() => {
  const { result_user_by_age, loading_user_by_age } = useReadUserByAge(
    webStore.latestTimeStamp
  );
  let data = (result_user_by_age || []).map(({ value }) => value);
  let sum = data.reduce((a: any, b: any) => a + b, 0);
  let max = Math.max.apply(Math, data);
  let index = data.indexOf(Math.max(max));
  return (
    <CardTopValue
      title="Top age"
      value={(result_user_by_age || [])[index]?.title}
      total={`${(result_user_by_age || [])[index]?.value} people`}
      // total={`${sum} people`}
    />
  );
});
