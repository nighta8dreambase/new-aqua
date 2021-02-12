import React, { Fragment, useEffect } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Grid,
  GridList,
  GridListTile,
  Paper,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";

import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import classes from "*.module.css";
import { useReadUserByGender } from "../../services/api/dashboard_report/useReadUserByGender";

import { useReadUserByAge } from "../../services/api/dashboard_report/useReadUserByAge";
import { useReadUser } from "../../services/api/user/useReadUser";
import { useListUser } from "../../services/api/user/useListUser";
import { useReadLengthOfStay } from "../../services/api/dashboard_report/useReadLengthOfStay";
import {
  Chart,
  PieSeries,
  Title,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";

import { Animation } from "@devexpress/dx-react-chart";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import { CardTotalUserByGender } from "./CardTotalUserByGender";
import { CardNationality } from "./CardNationality";
import { CardAge } from "./CardAge";
import { CardLengthOfStay } from "./CardLengthOfStay";
import { useHistory } from "react-router-dom";
import { useListSOSUser } from "../../services/api/user/useListSOSUser";
import { dateStr } from "../../utils";

const columns: ColDef[] = [
  { field: "name", headerName: "name", width: 120 },
  { field: "surname", headerName: "surname", width: 120 },
  { field: "gender", headerName: "gender", width: 120 },
  { field: "yatch_name", headerName: "yatch_name", width: 120 },
  { field: "nationality", headerName: "nationality", width: 120 },
  { field: "latest_body_temp", headerName: "body_temp", width: 120 },
  { field: "latest_heart_rate", headerName: "heart_rate", width: 120 },
  { field: "latest_blood_pressure", headerName: "blood_pressure", width: 120 },
  { field: "latest_device_status", headerName: "device_status", width: 120 },
  { field: "latest_battery", headerName: "battery", width: 120 },
  { field: "length_of_stay", headerName: "length_of_stay", width: 130 },
  { field: "timeStamp", headerName: "timeStamp", width: 230 },
];
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: {
      flexWrap: "nowrap",
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: "translateZ(0)",
    },
  })
);
export const CardSOS = observer(() => {
  const { result_userListSOS_raw, loading_userListSOS } = useListSOSUser();

  const history = useHistory();
  const classes = useStyles();

  return (
    <Paper
      style={{
        display: "flex",
        flex: 1,
        minHeight: "100%",
        flexDirection: "column",
      }}
      className="relative"
      variant="outlined"
      css={{ borderWidth: 0 }}
    >
      {loading_userListSOS && (
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
        className="p-2"
      >
        <div className="p-4 flex justify-between items-center">
          <Typography gutterBottom style={{ fontWeight: "bold" }}>
            SOS User list
          </Typography>
        </div>
        <div className={classes.gridList}>
          {(result_userListSOS_raw || []).map(({ user, created_at }) => {
            //
            return (
              <div
                style={{ height: "auto", marginBottom: "2rem" }}
                onClick={() => {
                  history.push("/user/" + user.id + "/preview");
                }}
              >
                <Box className="p-2">
                  <CardActionArea>
                    <Paper>
                      <Box className="p-2">
                        <Grid
                          direction="row"
                          container
                          alignItems="center"
                          spacing={2}
                          className="bg-red-600"
                        >
                          <Grid item>
                            <Avatar alt={user.name} src={user.avatar} />
                          </Grid>
                          <Grid item className="text-white">
                            <Grid item>{user.name}</Grid>
                            <Grid item className="text-xs">
                              {dateStr(new Date(created_at))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </CardActionArea>
                </Box>
              </div>
            );
          }) || []}
        </div>
      </Box>
    </Paper>
  );
});
