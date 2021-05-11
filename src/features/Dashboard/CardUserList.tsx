import React, { Fragment, useEffect, useState } from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Avatar,
  Box,
  Button,
  CardActionArea,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import {
  DataGrid,
  ColDef,
  ValueGetterParams,
  CellParams,
} from "@material-ui/data-grid";

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
import { CardTotalUserByGender } from "./CardTotalUserByGender";
import { CardNationality } from "./CardNationality";
import { CardAge } from "./CardAge";
import { CardLengthOfStay } from "./CardLengthOfStay";
import { useHistory } from "react-router-dom";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { dateStr, dateStrAPI } from "../../utils";
import Pagination from "@material-ui/lab/Pagination";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import FavoriteIcon from "../../components/assets/favorite.svg";
import TemperatureIcon from "../../components/assets/temperature.svg";
import BloodIcon from "../../components/assets/blood.svg";
import BatteryIconFull from "../../components/assets/noun_Battery_3408796.svg";
import BatteryIconHigh from "../../components/assets/noun_Battery_-1.svg";
import BatteryIconMedium from "../../components/assets/noun_Battery_-2.svg";
import BatteryIconLow from "../../components/assets/noun_Battery_-3.svg";
import BatteryIconLoss from "../../components/assets/noun_Battery_-4.svg";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Filter, User, UserFromAPI, UsersQuarantine } from "../../types/user";
import { userDevice } from "../../types/device";
import { useListAllUser } from "../../services/api/user/useListAllUser";
import { Places } from "../../types/places";

const DeviceValue = observer(
  ({
    icon,
    value,
    position,
  }: {
    icon: any;
    value: string;
    position?: string;
  }) => {
    return (
      <Box
        display={{ md: "flex" }}
        alignItems="center"
        css={{ color: "#595960", height: "100%" }}
        justifyContent={"flex-start"}
        textAlign="center"
      >
        <Box
          justifyContent="center"
          display="flex"
          mb={{ xs: 0.5, md: 0 }}
          height={{ xs: 14, md: "100%" }}
        >
          <img
            src={icon}
            css={{
              "@media (max-width: 992px)": { maxHeight: 14, maxWidth: 14 },
            }}
          />
        </Box>
        <Box ml={0.5} fontSize={13}>
          {value}
        </Box>
      </Box>
    );
  }
);

export const OnlineTab = observer(
  ({ user, device }: { user: User; device?: userDevice }) => {
    return (
      <Box display="flex" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          mr={3}
          css={{
            color: device?.device_status === 1 ? "#10940E" : "#C4C4C4",
          }}
        >
          <Box
            css={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                device?.device_status === 1 ? "#10940E" : "#C4C4C4",
            }}
          ></Box>
          <Box ml={1} fontSize={12}>
            {device?.device_status === 1 ? "Wearing" : "Not Wear"}
          </Box>
        </Box>
        {device?.device_status === 1 ? (
          <Box display="flex" alignItems="center" css={{ color: "#10940E" }}>
            <WifiIcon css={{ width: 15 }} />
            <Box ml={1} fontSize={12}>
              Online
            </Box>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" css={{ color: "#C4C4C4" }}>
            <WifiOffIcon css={{ width: 15 }} />
            <Box ml={1} fontSize={12}>
              Offline
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

export const DeviceValueTab = observer(
  ({ device }: { device?: userDevice }) => {
    var iconBattery;
    if(typeof device !== 'undefined'){
      if(device.battery.toString() < "0"){
        iconBattery = BatteryIconLoss;
      }else if(device.battery.toString() === "0"){
        iconBattery = BatteryIconLoss;
      }else if(device.battery.toString() === "1"){
        iconBattery = BatteryIconLow;
      }else if(device.battery.toString() === "2"){
        iconBattery = BatteryIconMedium;
      }else if(device.battery.toString() === "3"){
        iconBattery = BatteryIconHigh;
      }else if(device.battery.toString() === "4"){
        iconBattery = BatteryIconFull;
      }else if(device.battery.toString() > "4"){
        iconBattery = BatteryIconFull;
      }
    }
    return (
      <Grid container>
        <Grid item xs={3} style={{ maxWidth: "4.5rem" }}>
          {device?.body_temp ? (
            <DeviceValue
              icon={TemperatureIcon}
              value={device?.body_temp.toString()}
            />
          ) : (
            <DeviceValue icon={TemperatureIcon} value={"?"} />
          )}
        </Grid>
        <Grid item xs={3} style={{ maxWidth: "4.5rem" }}>
          {device?.heart_rate ? (
            <DeviceValue
              icon={FavoriteIcon}
              value={device?.heart_rate.toString()}
            />
          ) : (
            <DeviceValue icon={FavoriteIcon} value={"?"} />
          )}
        </Grid>
        <Grid item xs={3} style={{ maxWidth: "6rem" }}>
          <DeviceValue
            icon={BloodIcon}
            value={`${device?.blood_systolic || "?"} / ${
              device?.blood_diastolic || "?"
            }`}
          />
        </Grid>
        <Grid item xs={3} style={{ maxWidth: "3rem" }}>
          <DeviceValue
            icon={iconBattery}
            value={``}
            position="right"
          />
        </Grid>
      </Grid>
    );
  }
);

export const UserItem = observer(
  ({
    user,
    device,
    place,
    borderTop,
    index,
  }: {
    user: User;
    device?: userDevice;
    place?: Places;
    index: number;
    borderTop?: boolean;
  }) => {
    const history = useHistory();
    return (
      <Box
        className="relative"
        css={{
          backgroundColor: "#fff",
          borderRadius: 5,
          cursor: "pointer",
          "@media (max-width: 992px)": { marginBottom: 15 },
        }}
        onClick={() => {
          history.push("/user/" + user.id + "/preview");
        }}
      >
        <Box
          display="flex"
          py={2}
          px={{ xs: 2, md: 0 }}
          borderTop={borderTop ? "1px solid #ddd" : 0}
          css={{
            opacity: device?.latitude && device?.longitude ? 1 : 0.5,
            "@media (max-width: 992px)": { borderTop: 0 },
            "&:hover": {
              backgroundColor: "rgba(3,169,244,0.08)",
              borderTop: 0,
            },
          }}
        >
          <Box pr={2}>
            <Avatar css={{ width: 32, height: 32 }} src={user?.avatar}>
              {user?.name.substring(0, 1)}
            </Avatar>
          </Box>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box mb={2} position="relative">
                <Box
                  display="flex"
                  alignItems="center"
                  css={{ color: "#35353F" }}
                >
                  <Box fontWeight={600} fontSize={14} mr={1}>
                    {`${user?.name} ${user.surname}`}
                  </Box>
                  {user?.isSos && (
                    <ReportProblemIcon
                      css={{
                        color: "#C83728",
                        width: 16,
                        height: 16,
                        marginRight: "0.3em",
                      }}
                    />
                  )}
                  <Box position="relative">
                    <Box
                      className="pin"
                      css={{
                        "--color":
                          device?.device_status === 1 ? "green" : "red",
                      }}
                    >
                      {index.toString()}
                    </Box>
                  </Box>
                </Box>
                <Box fontSize={12} css={{ color: "#5B5B62" }}>
                  {`${
                    user.gender === "m"
                      ? "Male"
                      : user.gender === "f"
                      ? "Female"
                      : ""
                  }
              | ${user.nationality} | ${place?.name_en}`}
                </Box>
                {/* <Box
                  display={{ xs: "block", md: "none" }}
                  position="absolute"
                  right={0}
                  top="calc(50% - 15px)"
                >
                  <ArrowForwardIosIcon css={{ fontSize: 15 }} />
                </Box> */}
              </Box>
            </Grid>
            <Grid item md={4}>
              <Box
                fontSize={12}
                textAlign="right"
                css={{ color: "rgba(30, 30, 30, 0.5)" }}
                display={{ xs: "none", md: "block" }}
              >
                {device?.updated_at && dateStr(new Date(device?.updated_at))}
              </Box>
            </Grid>
            <Grid item md={6}>
              <Box display={{ xs: "none", md: "block" }}>
                <OnlineTab user={user} device={device} />
              </Box>
            </Grid>
            <Grid
              md={6}
              xs={10}
              item
              // spacing={2}
              style={{ justifyContent: "flex-end" }}
            >
              <DeviceValueTab device={device} />
            </Grid>
          </Grid>
        </Box>
        <Box
          display={{ xs: "flex", md: "none" }}
          px={2}
          py={1}
          justifyContent="space-between"
          alignItems="center"
          css={{
            opacity: device?.latitude && device?.longitude ? 1 : 0.5,
            "@media (max-width: 992px)": { borderTop: "1px solid #ddd" },
          }}
        >
          <OnlineTab user={user} device={device} />
          <Box
            fontSize={12}
            textAlign="right"
            css={{ color: "rgba(30, 30, 30, 0.5)" }}
          >
            {device?.updated_at && dateStr(new Date(device?.updated_at))}
          </Box>
        </Box>
      </Box>
    );
  }
);

export const CardUserList = observer(
  ({
    result_userList,
    loading_userList,
    total = 0,
    filter,
    mapRef,
    setPage,
  }: {
    result_userList: UsersQuarantine[];
    loading_userList: boolean;
    total?: number;
    mapRef?: any;
    filter?: Filter;
    setPage: (pn: number) => void;
  }) => {
    const [userLiser, setUserLiser] = useState<UsersQuarantine[]>([]);
    useEffect(() => {
      setUserLiser(
        result_userList
        // result_userList.filter((user) => {
        //   return user.device?.latitude && user.device?.latitude;
        //   return user.device?.latitude && user.device?.latitude;
        // })
      );
    }, [result_userList]);
    // const total = userLiser.length;
    const pageCount = Math.ceil(total / (filter?.perPage || 10));
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };

    return (
      <Box
        className="relative"
        css={{
          backgroundColor: "#fff",
          borderRadius: 5,
          cursor: "pointer",
          "@media (max-width: 992px)": { backgroundColor: "transparent" },
          height: "100%",
        }}
      >
        {loading_userList && (
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
              Total {total} User
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
          <Box>
            {(userLiser || []).map((user, i) => {
              var index =
                ((filter?.page || 1) - 1) * (filter?.perPage || 10) + i + 1;
              return (
                <div
                  onMouseEnter={() => {
                    mapRef &&
                      mapRef.current &&
                      user.device?.longitude &&
                      user.device?.latitude &&
                      mapRef.current.focus &&
                      mapRef.current.focus(
                        user.device?.latitude,
                        user.device?.longitude,
                        index.toString()
                      );
                  }}
                  onMouseLeave={() => {
                    mapRef &&
                      mapRef.current &&
                      mapRef.current.reset &&
                      mapRef.current.reset();
                  }}
                >
                  <UserItem {...user} index={index} borderTop={i !== 0} />
                </div>
              );
            })}
          </Box>
          {pageCount > 1 && (
            <Box mt={2}>
              <Pagination
                count={pageCount}
                page={filter?.page || 1}
                onChange={handleChange}
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);
