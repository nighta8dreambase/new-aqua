import React, { Fragment, useEffect, useState } from "react";
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
  Select,
  MenuItem,
  Badge,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";

import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
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
import { User } from "../../types/user";
import WarningIcon from "@material-ui/icons/Warning";
import { DeviceValueTab, OnlineTab } from "./CardUserList";
import { userDevice } from "../../types/device";
import CheckIcon from "@material-ui/icons/Check";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Pagination from "@material-ui/lab/Pagination";
import { Places } from "../../types/places";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customBadge: {
      backgroundColor: "green",
      border: "2px solid #fff",
      width: 15,
      height: 15,
      borderRadius: "100%",
    },
  })
);
const SOSItem = observer(
  ({
    user,
    device,
    fullDetail,
    border,
    place,
    BTUtcTime,
  }: {
    user: User;
    device?: userDevice;
    fullDetail?: boolean;
    place?: Places;
    border?: boolean;
    BTUtcTime?: any;
  }) => {
    const classes = useStyles();
    // console.log("BTUtcTime",BTUtcTime);
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          borderBottom={border ? "1px solid #ddd" : ""}
        >
          <Box display="flex">
            <Badge
              overlap="circle"
              variant="dot"
              classes={{ badge: classes.customBadge }}
            >
              <Avatar css={{ width: 32, height: 32 }} src={user?.avatar}>
                {user?.name.substring(0, 1)}
              </Avatar>
            </Badge>
            <Box mx={3}>
              <Box fontWeight={600} display="flex">
                {`${user?.name} ${user?.surname}`}
                {!fullDetail && (
                  <Box
                    ml={2}
                    mx={{ xs: 0, md: 2 }}
                    mt={{ xs: 1, md: 0 }}
                    css={{ color: "#C83728" }}
                    display="flex"
                    alignItems="center"
                    fontSize={12}
                    fontWeight={400}
                  >
                    <WarningIcon fontSize="small" />
                    <Box ml={0.5}>{dateStr(new Date(BTUtcTime))}</Box>
                  </Box>
                )}
              </Box>
              <Box display="flex" fontSize={12} flexWrap="wrap">
                <Box css={{ color: "#5B5B62" }}>
                  {`${
                    user?.gender === "m"
                      ? "Male"
                      : user?.gender === "f"
                      ? "Female"
                      : ""
                  }
              | ${user?.nationality} | ${place?.name_en || user?.yatch_name}`}
                </Box>
                {fullDetail && (
                  <>
                    <Box
                      mx={{ xs: 0, md: 2 }}
                      mt={{ xs: 1, md: 0 }}
                      css={{ color: "#C83728" }}
                      display="flex"
                      alignItems="center"
                    >
                      <WarningIcon fontSize="small" />
                      <Box ml={0.5}>{dateStr(new Date(user.updated_at))}</Box>
                    </Box>
                    <Box mx={2} display={{ xs: "none", md: "block" }}>
                      <OnlineTab user={user} device={device} />
                    </Box>
                    <Box
                      mx={2}
                      display={{ xs: "none", md: "block" }}
                      css={{ minWidth: 250 }}
                    >
                      <DeviceValueTab device={device} />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Box display={{ xs: "none", md: "block" }}>
            <CheckIcon color="primary" />
          </Box>
          <Box display={{ xs: "block", md: "none" }}>
            <ChevronRightIcon css={{ color: "#A9A2A2" }} />
          </Box>
        </Box>
      </>
    );
  }
);

export const CardSOS = observer(({ fullDetail }: { fullDetail?: boolean }) => {
  const history = useHistory();
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCont] = useState<number>(0);
  const perPage = 10;

  const { result_userListSOS_raw, loading_userListSOS } = useListSOSUser();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    console.log("result_userListSOS_raw",result_userListSOS_raw);
    setTotal(result_userListSOS_raw.length);
    setPageCont(Math.ceil(result_userListSOS_raw.length / (perPage || 10)));
  }, [result_userListSOS_raw]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      css={{
        display: "flex",
        flex: 1,
        minHeight: "100%",
        flexFlow: "column",
        // flexDirection: "column",
        borderRadius: 10,
        "@media (min-width: 991px)": { backgroundColor: "#fff" },
      }}
      className="relative"
    >
      {loading_userListSOS && (
        <LinearProgress
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        />
      )}
      <Box py={2} px={{ xs: 0, md: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box fontSize={14} fontWeight={600}>
            {fullDetail ? `Total ${total} User` : `SOS user`}
          </Box>
          <Box display="flex" alignItems="center" fontSize={14}>
            <Box mr={1}>Sort by</Box>
            <Select
              labelId="label"
              id="select"
              value="oldest_first"
              disableUnderline
              css={{ fontSize: 14, fontFamily: "inherit", color: "#4684E2" }}
            >
              <MenuItem value="oldest_first">Oldest first</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box
          css={{
            "@media (max-width: 992px)": {
              backgroundColor: "#fff",
              borderRadius: 5,
            },
          }}
          p={{ xs: 2, md: 0 }}
        >
          {(result_userListSOS_raw || []).map((user, i, BTUtcTime) => {
            // console.log("user", user);
            if(user.BTUtcTime != null){
              return (
                <SOSItem
                  {...user}
                  fullDetail={fullDetail}
                  border={i !== result_userListSOS_raw.length - 1}
                />
              );
            }
              
          })}
        </Box>
        {pageCount > 1 && (
          <Box mt={2}>
            <Pagination
              count={pageCount}
              page={page || 1}
              onChange={handleChange}
              size="small"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
});
