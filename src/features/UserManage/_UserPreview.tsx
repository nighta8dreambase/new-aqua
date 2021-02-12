import React, { Fragment, useEffect } from "react";
import { Box, Container, Grid, Paper, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

import { SubBar } from "../Dashboard/Dashboard";
import { useParams } from "react-router-dom";
import {
  ReadUserFilter,
  useReadUser,
} from "../../services/api/user/useReadUser";
import LuxonUtils from "@date-io/luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { UserInfoCard } from "./UserInfoCard";
import { DeviceHistoryDatagrid } from "./DeviceHistoryDatagrid";
import { DateFilter } from "../../components/DateFilter";

import { BodyTempGraph } from "./BodyTempGraph";
import { HeartRateGraph } from "./HeartRateGraph";
import { BloodPressureGraph } from "./BloodPressureGrph";
import { Map } from "../../components/Map";
import {
  BatteryHistoryReport,
  HeartRateHistoryReport,
  BloodPressureHistoryReport,
  WearingHistoryReport,
  TempHistoryReport,
} from "../../types/personalReport";

export type UserPreviewData = {
  loading: boolean;
  result_temp_history: TempHistoryReport | null;
  result_heart_rate_history: HeartRateHistoryReport | null;
  result_blood_pressure_history: BloodPressureHistoryReport | null;
  result_battery_history: BatteryHistoryReport | null;
  result_wearing_history: WearingHistoryReport | null;
};

export const UserPreview = observer(() => {
  const { userId }: any = useParams();

  const {
    result_userRead,
    result_userRead_raw,
    fire_userRead,
    loading_userRead,
    ...rest
  } = useReadUser(userId, webStore.readUserFilter);

  useEffect(() => {
    return () => {
      webStore.resetFilter();
    };
  }, []);
  const parseData: UserPreviewData = {
    loading: loading_userRead,
    ...rest,
  };
  return (
    <>
      <Container maxWidth="xl" className="py-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {result_userRead && (
              <SubBar back={true} title={"User : " + result_userRead.name} />
            )}
          </Grid>
          <Grid item container spacing={3}>
            <Grid item xs={12}>
              <DateFilter />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper style={{ minHeight: "100%" }}>
                {!result_userRead && (
                  <Box p={2}>
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />

                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />

                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                    <Skeleton animation="wave" height={60} />
                  </Box>
                )}
                {result_userRead && (
                  <UserInfoCard reload={fire_userRead} user={result_userRead} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper style={{ minHeight: "100%", position: "relative" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Temperature</Typography>
                      <Typography variant="h4" gutterBottom>
                        {result_userRead?.latest_body_temp}
                      </Typography>
                      <BodyTempGraph data={parseData} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper style={{ minHeight: "100%", position: "relative" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Heart rate</Typography>
                      <Typography variant="h4" gutterBottom>
                        {result_userRead?.latest_heart_rate}
                      </Typography>
                      <HeartRateGraph data={parseData} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper style={{ minHeight: "100%", position: "relative" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Blood pressure</Typography>
                      <Typography variant="h4" gutterBottom>
                        {result_userRead?.latest_blood_pressure}
                      </Typography>
                      <BloodPressureGraph data={parseData} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Paper style={{ minHeight: "100%" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Steps</Typography>
                      <Typography variant="h4">
                        {result_userRead?.total_step}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Paper style={{ minHeight: "100%" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Battery</Typography>
                      <Typography variant="h4">
                        {result_userRead?.latest_battery}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <Paper style={{ minHeight: "100%" }}>
                    <Box p={3}>
                      <Typography gutterBottom>Status</Typography>
                      <Typography variant="h4">
                        {result_userRead?.latest_device_status === false
                          ? "Off"
                          : "On"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper style={{ height: 400, position: "relative" }}>
                {result_userRead_raw && (
                  <Map
                    locations={(result_userRead_raw.locations || [])
                      .filter(({ latitude, longitude }) => {
                        return (
                          latitude > 0 &&
                          longitude > 0 &&
                          Math.abs(latitude) <= 90 &&
                          Math.abs(longitude) <= 180
                        );
                      })
                      .map(({ latitude, longitude }, i) => {
                        return {
                          lat: latitude,
                          lng: longitude,
                          active: true,
                          name: (i + 1).toString(),
                        };
                      })}
                  ></Map>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <DeviceHistoryDatagrid data={parseData} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});
export const UserPreviewMobile = UserPreview;
