import React, { Fragment, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Box,
  Button,
  CardActionArea,
  LinearProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import classes from "*.module.css";
import { useReadUserByGender } from "../../services/api/dashboard_report/useReadUserByGender";
import { Doughnut } from "react-chartjs-2";
import { useReadUserByNationality } from "../../services/api/dashboard_report/useReadUserByNationality";
import { GRAPH_COLOR } from "../../data/graphColor";
import { CustomeLabels } from "./CardTotalUserByGender";
import { CardTopValue } from "./Dashboard";

export const CardNationality = observer(() => {
  const {
    result_user_by_nation,
    loading_user_by_nation,
  } = useReadUserByNationality(webStore.latestTimeStamp); //
  return (
    <CardActionArea
      style={{
        display: "flex",
        flex: 1,
        minHeight: "100%",
        flexDirection: "column",
      }}
    >
      <Box
        css={{
          width: "100%",
          flex: 1,
          minHeight: "100%",
          display: "flex",
          flexFlow: "column",
          borderRadius: 5,
          backgroundColor: "#fff",
        }}
      >
        {loading_user_by_nation && (
          <LinearProgress
            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
        )}
        <Box
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
          }}
          p={2}
        >
          <Box fontWeight="bold" mb={2}>
            Nationality
          </Box>
          <Grid
            item
            direction="row"
            container
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            <Grid
              xs={12}
              md={5}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Doughnut
                height={200}
                legend={{ position: "bottom" }}
                data={{
                  datasets: [
                    {
                      data: (result_user_by_nation || []).map(
                        ({ value }) => value
                      ),
                      backgroundColor: GRAPH_COLOR,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  tooltips: {
                    callbacks: {
                      label: (tooltipItem: any, data: any) => {
                        return ` ${
                          (result_user_by_nation || [])[tooltipItem.index].title
                        } ${data.datasets[0].data[tooltipItem.index]}`;
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid xs={12} md={7}>
              <Box pl={{ md: 4, xs: 2 }} pr={{ md: 2, xs: 3 }} fontSize={14}>
                <CustomeLabels
                  data={(result_user_by_nation || []).map(({ value }) => value)}
                  labels={(result_user_by_nation || []).map(
                    ({ title }) => title
                  )}
                  color={GRAPH_COLOR}
                  itemsCountPerPage={4}
                  showValue={true}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CardActionArea>
  );
});

export const CardTopNationality = observer(() => {
  const {
    result_user_by_nation,
    loading_user_by_nation,
  } = useReadUserByNationality(webStore.latestTimeStamp);
  let data = (result_user_by_nation || []).map(({ value }) => value);
  let sum = data.reduce((a: any, b: any) => a + b, 0);
  let max = Math.max.apply(Math, data);
  let index = data.indexOf(Math.max(max));
  return (
    <CardTopValue
      title="Top nationality"
      value={(result_user_by_nation || [])[index]?.title}
      // total={`${sum} people`}
      total={`${(result_user_by_nation || [])[index]?.value} people`}
    />
  );
});
