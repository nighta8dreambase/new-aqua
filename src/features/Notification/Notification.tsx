import React, { useEffect } from "react";

import {
  Box,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  makeStyles,
  Divider,
  AppBar,
  CircularProgress,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { Theme } from "@emotion/react";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useListNotifications } from "../../services/api/notification/useListNotifications";
import { useHistory } from "react-router-dom";

export const Notification = observer((props: any) => {
  useEffect(() => {
    return () => {
      webStore.resetFilter();
    };
  }, []);

  const mobile = webStore.device === "mobile";
  const { result: data, loading, error } = useListNotifications();
  const [value, setValue]: any = React.useState("0");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const datasource =
    value === "0"
      ? data &&
        data.filter((d: any, i: any) => {
          // let currentDate = new Date().setHours(0, 0, 0, 0)
          // let sevenPrevDate = new Date(currentDate).setDate(new Date(currentDate).getDate() - 7)
          // return new Date(d.datetime).setHours(0, 0, 0, 0) >= sevenPrevDate
          return !d.read;
        })
      : data;

  if (props.popup && props.setNotiCount) {
    props.setNotiCount(datasource && datasource.length ? datasource.length : 0);
  }

  return props.popup ? (
    <NotificationPopup datasource={datasource} loading={loading} />
  ) : mobile ? (
    <NotificationMobile
      value={value}
      handleChange={handleChange}
      datasource={datasource}
      loading={loading}
    />
  ) : (
    <NotificationDesktop
      value={value}
      handleChange={handleChange}
      datasource={datasource}
      loading={loading}
    />
  );
});

export const NotificationPopup = observer((props: any) => {
  const history = useHistory();
  return (
    <div css={{ width: "30vw", maxHeight: "50vh", overflow: "scroll" }}>
      <Paper>
        {props.loading ? (
          <Box p={8} display="flex" justifyContent="center">
            <CircularProgress css={{ color: "var(--primary)" }} />
          </Box>
        ) : (
          <>
            {props.datasource && props.datasource.length > 0 ? (
              <Box p={2.5}>
                {props.datasource.map((d: any, i: any) => {
                  let showDate = false;
                  let thisNoti = new Date(d.datetime).setHours(0, 0, 0, 0);
                  let currentDate = new Date().setHours(0, 0, 0, 0);
                  if (i != 0) {
                    let prevNoti = new Date(
                      props.datasource[i - 1].datetime
                    ).setHours(0, 0, 0, 0);
                    if (thisNoti != currentDate) {
                      if (thisNoti === prevNoti) {
                        showDate = false;
                      } else {
                        showDate = true;
                      }
                    }
                  } else {
                    if (thisNoti != currentDate) {
                      showDate = true;
                    }
                  }
                  return (
                    <NotificationCard
                      {...d}
                      key={i}
                      index={i}
                      showDate={showDate}
                      popup={true}
                    />
                  );
                })}
              </Box>
            ) : (
              <Box fontSize={14} fontWeight={600} p={4}>
                There are no new Notifications
              </Box>
            )}
          </>
        )}
      </Paper>
    </div>
  );
});

export const NotificationDesktop = observer((props: any) => {
  const useStyles = makeStyles((theme: Theme) => ({
    tab: {
      textTransform: "none",
      minWidth: "0",
      marginRight: "10px",
      marginLeft: "20px",
      "&:focus": {
        outline: "none",
      },
    },
    activeTab: {
      color: "var(--primary)",
      fontWeight: "bold",
    },
    indicator: {
      backgroundColor: "var(--primary)",
      paddingTop: "4px",
    },
  }));

  const classes = useStyles();

  return (
    <Container maxWidth="xl" className="py-4">
      <Grid container spacing={3}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Box mb={2}>
            <SubBar back={false} reload={false} title={"Notification"} />
          </Box>
          <Tabs
            value={props.value}
            onChange={props.handleChange}
            classes={{
              indicator: classes.indicator,
            }}
          >
            <Tab
              className={`${classes.tab} ${
                props.value === "0" ? classes.activeTab : ""
              }`}
              value="0"
              label={<span>New</span>}
            />
            <Tab
              className={`${classes.tab} ${
                props.value === "1" ? classes.activeTab : ""
              }`}
              value="1"
              label={<span>All</span>}
            />
          </Tabs>
          <Paper>
            {props.loading ? (
              <Box p={8} display="flex" justifyContent="center">
                <CircularProgress css={{ color: "var(--primary)" }} />
              </Box>
            ) : props.datasource && props.datasource.length > 0 ? (
              <Box p={4}>
                {props.datasource.map((d: any, i: any) => {
                  let showDate = false;
                  let thisNoti = new Date(d.datetime).setHours(0, 0, 0, 0);
                  let currentDate = new Date().setHours(0, 0, 0, 0);
                  if (i != 0) {
                    let prevNoti = new Date(
                      props.datasource[i - 1].datetime
                    ).setHours(0, 0, 0, 0);
                    if (thisNoti != currentDate) {
                      if (thisNoti === prevNoti) {
                        showDate = false;
                      } else {
                        showDate = true;
                      }
                    }
                  } else {
                    if (thisNoti != currentDate) {
                      showDate = true;
                    }
                  }
                  return (
                    <NotificationCard
                      {...d}
                      key={i}
                      index={i}
                      showDate={showDate}
                      mobile={false}
                    />
                  );
                })}
              </Box>
            ) : (
              <Box fontSize={14} fontWeight={600} p={4}>
                There are no {props.value === "0" ? " new " : ""} Notifications
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
});

export const NotificationMobile = observer((props: any) => {
  const useStyles = makeStyles((theme: Theme) => ({
    tab: {
      textTransform: "none",
      minWidth: "0",
      marginRight: "10px",
      marginLeft: "20px",
      "&:focus": {
        outline: "none",
      },
    },
    activeTab: {
      color: "var(--primary)",
      fontWeight: "bold",
    },
    indicator: {
      backgroundColor: "var(--primary)",
      paddingTop: "4px",
    },
  }));

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box mb={2} ml={2}>
          <SubBar back={false} reload={false} title={"Notification"} />
        </Box>
        <Tabs
          value={props.value}
          onChange={props.handleChange}
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab
            className={`${classes.tab} ${
              props.value === "0" ? classes.activeTab : ""
            }`}
            value="0"
            label={<span>New</span>}
          />
          <Tab
            className={`${classes.tab} ${
              props.value === "1" ? classes.activeTab : ""
            }`}
            value="1"
            label={<span>All</span>}
          />
        </Tabs>
        <Paper>
          {props.loading ? (
            <Box p={8} display="flex" justifyContent="center">
              <CircularProgress css={{ color: "var(--primary)" }} />
            </Box>
          ) : props.datasource && props.datasource.length > 0 ? (
            <Box p={3}>
              {props.datasource.map((d: any, i: any) => {
                let showDate = false;
                let thisNoti = new Date(d.datetime).setHours(0, 0, 0, 0);
                let currentDate = new Date().setHours(0, 0, 0, 0);
                if (i != 0) {
                  let prevNoti = new Date(
                    props.datasource[i - 1].datetime
                  ).setHours(0, 0, 0, 0);
                  if (thisNoti != currentDate) {
                    if (thisNoti === prevNoti) {
                      showDate = false;
                    } else {
                      showDate = true;
                    }
                  }
                } else {
                  if (thisNoti != currentDate) {
                    showDate = true;
                  }
                }
                return (
                  <NotificationCard
                    {...d}
                    key={i}
                    index={i}
                    showDate={showDate}
                    mobile={true}
                  />
                );
              })}
            </Box>
          ) : (
            <Box fontSize={14} fontWeight={600} p={4}>
              There are no {props.value === "0" ? " new " : ""} Notifications
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
});

export const NotificationCard = observer((props: any) => {
  const formatDate = (d: Date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let formattedDate =
      "" +
      (d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear());
    return formattedDate;
  };

  const formatTime = (d: Date) => {
    let formattedTime =
      "" +
      (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) +
      ":" +
      (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes());
    return formattedTime;
  };

  return props.popup ? (
    <NotificationCardPopup
      formatDate={formatDate}
      formatTime={formatTime}
      {...props}
    />
  ) : props.mobile ? (
    <NotificationCardMobile
      formatDate={formatDate}
      formatTime={formatTime}
      {...props}
    />
  ) : (
    <NotificationCardDesktop
      formatDate={formatDate}
      formatTime={formatTime}
      {...props}
    />
  );
});

export const NotificationCardPopup = observer((props: any) => {
  return (
    <Grid item xs={12}>
      {props.index != 0 ? (
        <Box my={2}>
          <Divider />
        </Box>
      ) : (
        ""
      )}
      {props.showDate ? (
        <Box mt={props.index != 0 ? 4 : 0} mb={3} fontWeight="600">
          {props.formatDate(props.datetime)}
        </Box>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Grid justify="space-between" wrap="nowrap" container>
          <Grid container wrap="nowrap">
            {props.type === "ERROR" ? (
              <WarningIcon fontSize={"small"} css={{ color: "var(--error)" }} />
            ) : (
              <ErrorIcon fontSize={"small"} css={{ color: "var(--primary)" }} />
            )}
            <Box ml={2}>
              <Box fontWeight="600" fontSize={14}>
                {props.title}
              </Box>
              <Box fontSize={14}>{props.content}</Box>
            </Box>
          </Grid>
          <Box fontWeight="600" fontSize={14}>
            {props.formatTime(props.datetime)}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
});

export const NotificationCardDesktop = observer((props: any) => {
  return (
    <Grid item xs={12}>
      {props.showDate ? (
        <Box
          mt={props.index != 0 ? 6 : 0}
          mb={5}
          fontWeight="600"
          css={{ color: "var(--gray)" }}
        >
          {props.formatDate(props.datetime)}
        </Box>
      ) : (
        ""
      )}
      {props.index != 0 && !props.showDate ? (
        <Box my={2}>
          <Divider />
        </Box>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Grid justify="space-between" wrap="nowrap" container>
          <Grid container wrap="nowrap">
            {props.type === "ERROR" ? (
              <WarningIcon fontSize={"small"} css={{ color: "var(--error)" }} />
            ) : (
              <ErrorIcon fontSize={"small"} css={{ color: "var(--primary)" }} />
            )}
            <Box ml={2}>
              <Box fontWeight="600" fontSize={14}>
                {props.title}
              </Box>
              <Box fontSize={14}>{props.content}</Box>
            </Box>
          </Grid>
          <Box fontWeight="600" fontSize={14}>
            {props.formatTime(props.datetime)}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
});

export const NotificationCardMobile = observer((props: any) => {
  return (
    <Grid item xs={12}>
      {props.showDate ? (
        <Box mt={props.index != 0 ? 6 : 0} mb={5} fontWeight="600">
          {props.formatDate(props.datetime)}
        </Box>
      ) : (
        ""
      )}
      {props.index != 0 && !props.showDate ? (
        <Box my={2}>
          <Divider />
        </Box>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Grid justify="space-between" wrap="nowrap" container>
          <Grid container wrap="nowrap">
            {props.type === "ERROR" ? (
              <WarningIcon fontSize={"small"} css={{ color: "var(--error)" }} />
            ) : (
              <ErrorIcon fontSize={"small"} css={{ color: "var(--primary)" }} />
            )}
            <Box ml={2}>
              <Box fontWeight="600" fontSize={14}>
                {props.title}
              </Box>
              <Box fontSize={14}>{props.content}</Box>
              <Box fontWeight="600" fontSize={14} mt={1}>
                {props.formatTime(props.datetime)}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
