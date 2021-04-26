import React, { Fragment, useEffect, useState } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Box,
  Button,
  ButtonGroup,
  CardActionArea,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Tabs,
  Tab,
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
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { useHistory, useParams } from "react-router-dom";

import { dateStr } from "../../utils";
import {
  BatteryHistoryReport,
  BloodPressureHistoryReport,
  HeartRateHistoryReport,
  WearingHistoryReport,
} from "../../types/personalReport";
import { UserPreviewData } from "./UserPreview";

function tapsStyles() {
  return {
    indicator: {
      backgroundColor: "#fff",
    },
  };
}

function dataGridStyles() {
  return {
    root: {
      color: "inherit",
      borderWidth: 0,
    },
  };
}

export const DeviceHistoryDatagrid = observer(
  ({
    mode,
    data: {
      loading,
      result_temp_history,
      result_heart_rate_history,
      result_blood_pressure_history,
      result_battery_history,
      result_wearing_history,
    },
  }: {
    mode?: string;
    data: UserPreviewData;
  }) => {
    const { userId }: any = useParams();
    const classesTab = makeStyles(tapsStyles)();
    const classesDataGrid = makeStyles(dataGridStyles)();

    const history = useHistory();
    const TYPES = [
      {
        name: "Tempurature",
        field: "body_temp",
        data: result_temp_history || [],
      },
      {
        name: "Heart Rate",
        field: "heart_rate",
        data: result_heart_rate_history || [],
      },
      {
        name: "Blood pressrue",
        field: "blood_pressure",
        data: result_blood_pressure_history || [],
      },
      {
        name: "Battery",
        field: "battery",
        data: result_battery_history || [],
      },
      {
        name: "Wearing status",
        field: "device_status",
        data: result_wearing_history || [],
      },

      // { name: "Wearing Status"},
      // { name: "Battery"},
    ];

    const [t, setType] = useState(TYPES[0].name);
    const [valueTabs, setValueTabs] = useState(0);
    const selected: any = TYPES[TYPES.map(({ name }) => name).indexOf(t)];
    const columns: ColDef[] = [
      { field: "timeStamp", width: 200 },
      { field: selected.field, width: 100 },
      // { field: "length_of_stay", headerName: "length_of_stay", width: 200 },
    ];
    const data = (selected.data || []).map(({ ...d }) => {
      return { ...d, id: d.timestamp, timeStamp: dateStr(d.timestamp) };
    });

    const handleChangeTabs = (
      event: React.ChangeEvent<{}>,
      newValue: number
    ) => {
      console.log("handleChangeTabs", TYPES[newValue].name);
      setValueTabs(newValue);
      setType(TYPES[newValue].name);
    };
    console.log("data", data);
    return (
      <Box
        css={{
          borderRadius: 5,
          backgroundColor: "#3D6BAF",
          color: "#fff",
          height: "calc(100vh - 10rem)",
        }}
      >
        {loading && (
          <LinearProgress
            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
        )}

        <Tabs
          value={valueTabs}
          textColor="inherit"
          variant="scrollable"
          onChange={handleChangeTabs}
          css={{ paddingTop: 10 }}
          classes={{
            indicator: classesTab.indicator,
          }}
        >
          {TYPES.map(({ name }) => (
            <Tab
              label={name}
              css={{
                borderBottom: "1px solid rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </Tabs>
        <Box
          css={{
            width: "100%",
            height: "85%",
            // height: "calc(100vh - 10rem)",
            overflow: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
            " .MuiDataGrid-root": {
              borderWidth: 0,
              color: "inherit",
            },
          }}
          mt={2}
          px={2}
          id="tableDeviceHistoryDatagrid"
        >
          <DataGrid
            rows={data || []}
            columns={columns}
            pageSize={21}
            pagination
            disableSelectionOnClick={true}
            headerHeight={0}
            autoHeight={true}
            scrollbarSize={0}
            rowHeight={37}
            hideFooterPagination={true}
            hideFooterRowCount={true}
            // loading={true}
            // rowsPerPageOptions={[20, 50, 100]}
            // density="compact"
            // autoPageSize={true}
          />
        </Box>
      </Box>
    );
  }
);
