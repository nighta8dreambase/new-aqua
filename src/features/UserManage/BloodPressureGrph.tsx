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
import { Line } from "react-chartjs-2";
import { useReadUserByNationality } from "../../services/api/dashboard_report/useReadUserByNationality";
import { GRAPH_COLOR } from "../../data/graphColor";
import { useReadLengthOfStay } from "../../services/api/dashboard_report/useReadLengthOfStay";

import { useParams } from "react-router-dom";
import { timeStr } from "../../utils";
import { UserPreviewData } from "./UserPreview";
import { ResponsiveLineChart } from "../../components/ResponsiveLineChat";

export const BloodPressureGraph = observer(
  ({
    data: { loading, result_blood_pressure_history },
  }: {
    data: UserPreviewData;
  }) => {
    const { userId }: any = useParams();
    const GraphHeight = 300;
    const GraphColor = ["#84FAB0", "#A1B1FD"];
    const GraphData = (canvas: any) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, GraphHeight);
      gradient1.addColorStop(0, GraphColor[0]);
      gradient1.addColorStop(1, `#8FD3F4`);

      const gradient2 = ctx.createLinearGradient(0, 0, 0, GraphHeight);
      gradient2.addColorStop(0, GraphColor[1]);
      gradient2.addColorStop(1, `#C2E9FB`);

      return {
        datasets: [
          {
            label: "blood_diastolic",
            data: (result_blood_pressure_history || []).map(
              ({ blood_diastolic }) => blood_diastolic
            ),
            borderColor: GraphColor[1],
            backgroundColor: gradient2,
            fill: "start",
            // pointBackgroundColor: "transparent",
            // pointBorderColor: "transparent",
          },
          {
            label: "blood_systolic",
            data: (result_blood_pressure_history || []).map(
              ({ blood_systolic }) => blood_systolic
            ),
            borderColor: GraphColor[0],
            backgroundColor: gradient1,
            fill: "start",
            // pointBackgroundColor: "transparent",
            // pointBorderColor: "transparent",
          },
        ],
        labels: (result_blood_pressure_history || []).map(({ timestamp }, i) =>
          i === 0 ? "" : timeStr(timestamp)
        ),
      };
    };
    const lineProps = {
      legend: { position: "bottom", display: false },
      options: {
        maintainAspectRatio: false,

        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
        },
      },
      data: GraphData,
    };

    return (
      <Box css={{ borderRadius: 5, backgroundColor: "#fff", padding: 20 }}>
        {loading && (
          <LinearProgress
            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
        )}
        <Box fontWeight={600} mb={2}>
          Blood pressure
        </Box>
        <ResponsiveLineChart
          {...{
            device: webStore.device,
            lineProps: lineProps,
            GraphHeight,
          }}
        />
      </Box>
    );
  }
);
