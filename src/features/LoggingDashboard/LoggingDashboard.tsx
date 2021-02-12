import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  Accessibility,
  ArrowBack,
  Battery80,
  Bluetooth,
  Code,
  BlurOn,
  DirectionsWalk,
  Favorite,
  Fingerprint,
  ShowChart,
  Watch,
} from "@material-ui/icons";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useListUser } from "../../services/api/user/useListUser";
import { useReadUser } from "../../services/api/user/useReadUser";
import { webStore } from "../../stores/webStore";
import { UserFromAPI } from "../../types/user";
import { UserInfoCard } from "../UserManage/UserInfoCard";

const DeviceLog = observer(({ userId }: { userId: string }) => {
  const {
    result_userRead,
    result_userRead_raw,
    fire_userRead,
    loading_userRead,
    ...rest
  } = useReadUser(userId, webStore.readUserFilter, true);
  const [logs, setLogs] = useState<{ timeStamp: Date; data: UserFromAPI }[]>(
    []
  );
  useEffect(() => {
    const loopLoad = async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 2 * 1000);
      });

      try {
        const data = await fire_userRead();

        setLogs([{ timeStamp: new Date(), data: data?.data.data }, ...logs]);
      } catch {}
    };
    loopLoad();
    return () => {};
  }, [userId, logs.length]);

  return (
    <Box
      p={2}
      className="flex-1 w-full"
      style={{
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        overflowX: "hidden",
        overflowY: "auto",
        position: "absolute",
        background: "#222229",
      }}
    >
      <Box mb={4}>
        <Typography style={{ color: "white" }} variant="h6">
          Log
        </Typography>
      </Box>
      <div>
        {logs.map(({ timeStamp, data: { devices } }) => {
          return (
            <div
              style={{ color: "white" }}
              key={timeStamp.getDate()}
              className="md:flex items-start mb-6"
            >
              <div
                className="mr-4"
                style={{
                  whiteSpace: "nowrap",
                  color: devices?.[0].device_status ? "#5fe45f" : "#ff665e",
                }}
              >
                {DateTime.fromJSDate(timeStamp).toLocaleString(
                  DateTime.DATETIME_MED_WITH_SECONDS
                )}
              </div>
              <div className="flex-1" style={{ wordBreak: "break-all" }}>
                heart_rate:{devices?.[0].heart_rate?.toString()}
                {" , "}
                heart_rate:{devices?.[0].heart_rate?.toString()}
                {" , "}
                battery:{devices?.[0].battery?.toString()}
                {" , "}
                step:{devices?.[0].step?.toString()}
                {" , "}
                body_temp:{devices?.[0].body_temp?.toString()}
                {" , "}
                wristband_temp:{devices?.[0].wristband_temp?.toString()}
                {" , "}
                lng:{devices?.[0].latitude?.toString()}
                {" , "}
                lat:{devices?.[0].longitude?.toString()}
                {" , "}
                device_status:{devices?.[0].device_status?.toString()}
                {" , "}
                blood_pressure:{devices?.[0].blood_systolic?.toString()}/
                {devices?.[0].blood_diastolic?.toString()}
                {" , "}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
});

export const UserInfoCardWrapper = observer(
  ({ userId }: { userId: string }) => {
    const {
      result_userRead,
      result_userRead_raw,
      fire_userRead,
      loading_userRead,
      ...rest
    } = useReadUser(userId, webStore.readUserFilter);

    return (
      <>
        {result_userRead && (
          <UserInfoCard reload={fire_userRead} user={result_userRead} />
        )}
      </>
    );
  }
);

export const LoggingDashboard = observer(() => {
  const filter = {
    startDate: webStore.startDate,
    endDate: webStore.endDate,
    filter_temp: webStore.filter_temp,
    filter_wear: webStore.filter_wear,
    filter_battery: webStore.filter_battery,
    filter_yacht_name: webStore.filter_yacht_name,
    page: 1,
    perPage: 10,
  };
  const { result_userList, loading_userList } = useListUser(filter);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  useEffect(() => {
    if (!loading_userList && result_userList[0] && result_userList[0].user) {
      setActiveUserId(result_userList[0].user.id);
    }
  }, [loading_userList]);
  if (loading_userList) {
    return <></>;
  }

  return (
    <div
      className="flex relative"
      style={{
        position: "absolute",
        top: "4rem",
        width: "100%",
        bottom: "0%",
      }}
    >
      <Box
        p={2}
        className="overflow-x-hidden overflow-y-auto"
        style={{
          background: "white",
          width: 350,
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <Select
          labelId="user-selection"
          id="user-selection"
          fullWidth={true}
          value={activeUserId}
          onChange={(e) => {
            setActiveUserId(e.target.value as string);
          }}
        >
          {result_userList.map(
            ({ user: { id, name, surname, nationality } }) => {
              return (
                <MenuItem value={id}>
                  {name} {surname} {nationality}
                </MenuItem>
              );
            }
          )}
        </Select>

        {activeUserId && (
          <div key={activeUserId}>
            <UserInfoCardWrapper userId={activeUserId} />
          </div>
        )}
      </Box>
      {activeUserId && (
        <div
          style={{
            background: "white",
            left: 350,
            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
          }}
          key={activeUserId}
        >
          <DeviceLog userId={activeUserId} />
        </div>
      )}
    </div>
  );
});
