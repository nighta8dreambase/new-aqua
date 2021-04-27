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

export const HeartRateGraph = observer(
  ({
    data: { loading, result_heart_rate_history },
  }: {
    data: UserPreviewData;
  }) => {
    const { userId }: any = useParams();
    const GraphHeight = 300;
    const GraphColor = ["#FF9A9E"];
    const GraphData = (canvas: any) => {
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, GraphHeight);
      gradient.addColorStop(0, GraphColor[0]);
      gradient.addColorStop(1, `#FECFEF`);
      return {
        datasets: [
          {
            data: (result_heart_rate_history || []).map(
              ({ heart_rate }) => heart_rate
            ),
            borderColor: GraphColor[0],
            backgroundColor: gradient,
            fill: "start",
            // pointBackgroundColor: "transparent",
            // pointBorderColor: "transparent",
          },
        ],
        labels: (result_heart_rate_history || []).map(({ timestamp }, i) =>
          i === 0 ? "" : timeStr(timestamp)
        ),
      };
    }; //
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
          Heart Rate
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
