import React, { Fragment, useEffect, useState } from "react";
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
import { Map } from "../../components/Map";
import { useHistory } from "react-router-dom";
import { UsersQuarantine } from "../../types/user";

const useStyles = makeStyles((theme: any) => ({
  paper: {
    [theme.breakpoints.down("xs")]: {
      paddingTop: "100%",
    },
  },
}));
export const CardMap = observer(
  ({
    style,
    mapRef,
    result_userList,
    loading_userList,
    page,
    perPage,
    loadmore = false,
  }: {
    style?: any;
    mapRef: any;
    result_userList: UsersQuarantine[];
    loading_userList: boolean;
    page: number;
    perPage: number;
    loadmore?: boolean;
  }) => {
    const classes = useStyles();
    const history = useHistory();

    const handleClick = (id: string) => {
      history.push("/user/" + id + "/preview");
    };

    return (
      <div style={style} className={classes.paper + " flex-1 h-full relative"}>
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 5,
          }}
          css={{ borderWidth: 0 }}
        >
          {loading_userList && (
            <LinearProgress
              style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
            />
          )}
          <Map
            mapRef={mapRef}
            locations={(result_userList || [])
              .map(({ device, user, id }, i) => {
                return {
                  lat: device ? device.latitude : 0,
                  lng: device ? device.longitude : 0,
                  name: loadmore
                    ? (i + 1).toString()
                    : ((page - 1) * perPage + i + 1).toString(),
                  active: device?.device_status === 1 ? true : false,
                  hoverText: user.name,
                  onClick: () => {
                    handleClick(id);
                  },
                };
              })
              .filter(({ lat, lng }) => {
                return (
                  lat > 0 &&
                  lng > 0 &&
                  Math.abs(lat) <= 90 &&
                  Math.abs(lng) <= 180
                );
              })}
          />
        </Box>
      </div>
    );
  }
);

export const CardMapMemo = React.memo(
  ({
    style,
    mapRef,
    result_userList,
    loading_userList,
    page,
    perPage,
    loadmore = false,
  }: {
    style?: any;
    mapRef: any;
    result_userList: UsersQuarantine[];
    loading_userList: boolean;
    page: number;
    perPage: number;
    loadmore?: boolean;
  }) => {
    const [userLiser, setUserLiser] = useState<UsersQuarantine[]>([]);
    useEffect(() => {
      if (loadmore) {
        setUserLiser([...userLiser, ...result_userList]);
      } else {
        setUserLiser(result_userList);
      }
    }, [result_userList]);
    return (
      <CardMap
        style={style}
        result_userList={userLiser}
        loading_userList={loading_userList}
        page={page}
        perPage={perPage}
        mapRef={mapRef}
        loadmore={loadmore}
      />
    );
  }
);
