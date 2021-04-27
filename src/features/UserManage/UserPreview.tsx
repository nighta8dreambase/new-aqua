import React, { Fragment, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { StickyContainer, Sticky } from "react-sticky";
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
import { EditField, UserInfoCard, UserProfile } from "./UserInfoCard";
import { DeviceHistoryDatagrid } from "./DeviceHistoryDatagrid";
import { DateFilter } from "../../components/DateFilter";

import { BodyTempGraph } from "./BodyTempGraph";
import { HeartRateGraph } from "./HeartRateGraph";
import { BloodPressureGraph } from "./BloodPressureGrph";
import { Map } from "../../components/Map";
import CheckIcon from "@material-ui/icons/Check";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAccordion from "@material-ui/core/Accordion";
import WatchIcon from "@material-ui/icons/Watch";
import { dateStr, dateStrAPI } from "../../utils";

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

const DeviceField = observer((props: any) => {
  return (
    <Box
      borderRight={props.border ? props.border : 0}
      css={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <Box css={{ color: "#8F919C" }} fontSize={12} mb={0.5}>
        {props.label}
      </Box>
      <Box fontSize={18}>{props.children}</Box>
    </Box>
  );
});

function badgeStyles() {
  return {
    badgeActive: {
      backgroundColor: "#10940E",
    },
  };
}

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
  const [expanded, setExpanded] = React.useState<string | false>("panel0");

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };
  const Accordion = withStyles({
    root: {
      borderBottom: "1px solid rgba(0, 0, 0, .1)",
      boxShadow: "none",
      "&:last-child": {
        borderBottom: 0,
      },
      "&$expanded": {
        margin: "auto",
      },
    },
    expanded: {},
  })(MuiAccordion);

  console.log("parseData", result_userRead, result_userRead_raw);
  const classes = makeStyles(badgeStyles)();
  const [startDate, setStartDate] = useState<Date | null>(
    webStore.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    webStore.endDate || new Date()
  );
  const [filterHour, setFilterHour] = useState<number | null>(
    webStore.filter_hour
  );

  const onSearch = () => {
    webStore.setStartDate(startDate);
    webStore.setEndDate(endDate);
    webStore.set_filter_hour(filterHour);
  };

  const [isAddDevice, setIsAddDevice] = useState(false);
  const [newIMEI, setNewIMEI] = useState("");

  return (
    <Container maxWidth="xl" style={{ maxWidth: 1500 }} className="py-4 pb-16">
      <SubBar title={"User Detail"} reload={false} back={true} />
      {result_userRead_raw?.user.isSos && (
        <Box mt={2} mb={1}>
          <Box
            css={{ borderRadius: 5, backgroundColor: "#BC4538", color: "#fff" }}
          >
            <Box
              p={2}
              display={{ xs: "block", md: "flex" }}
              justifyContent="space-between"
              alignItems="center"
              textAlign="center"
            >
              <Box
                display={{ xs: "block", md: "flex" }}
                alignItems="center"
                mb={{ xs: 2, md: 0 }}
              >
                <ReportProblemIcon />
                <Box mx={2} fontWeight={600}>
                  This person trigger sos
                </Box>
                <Box>15:30 22/Nov/2020 </Box>
              </Box>
              <Button
                style={{ width: "fit-content" }}
                onClick={() => {}}
                color="inherit"
                startIcon={<CheckIcon />}
              >
                Mark resolve
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box>
        <Box
          css={{ borderRadius: 5, backgroundColor: "#2B5698", color: "#fff" }}
        >
          <Box display={{ xs: "block", md: "flex" }}>
            <Box
              p={4}
              width={{ xs: "100%", md: "40%" }}
              css={{ borderRight: "1px solid rgba(255,255,255,0.5)" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {result_userRead && (
                <UserProfile reload={fire_userRead} user={result_userRead} />
              )}
            </Box>
            <Box py={4} px={6} width={{ xs: "100%", md: "60%" }}>
              {result_userRead && (
                <UserInfoCard
                  reload={fire_userRead}
                  user={result_userRead}
                  userRaw={result_userRead_raw}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="flex justify-between items-center" mt={8} pb={2}>
        <Box fontSize="h5.fontSize" fontWeight={500}>
          Devices
        </Box>
        <Button
          startIcon={<AddIcon />}
          color="primary"
          size="small"
          variant="text"
          onClick={() => {
            setIsAddDevice(true);
          }}
        >
          CONNECT NEW DEVICES
        </Button>
      </Box>
      <EditField
        label="Connect new IMEI"
        field="imei"
        buttonName="CONNECT"
        isEdit={isAddDevice}
        setIsEdit={setIsAddDevice}
        value={newIMEI}
        setValue={setNewIMEI}
        onClick={async () => {
          // todo
          console.log("CONNECT NEW DEVICES");
        }}
      />
      <Box>
        {(result_userRead_raw?.devices || []).map((deivce, key) => {
          return (
            <Accordion
              square
              expanded={expanded === `panel${key}`}
              onChange={handleChange(`panel${key}`)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  display={{ xs: "block", md: "flex" }}
                  alignItems="center"
                  px={{ xs: 0, md: 3 }}
                  py={2}
                  css={{
                    color: deivce.device_status === 1 ? "#10940E" : "#B12143",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <WatchIcon />
                    <Box ml={2} mr={4} fontSize="h5.fontsize" fontWeight={600}>
                      {`Device ${key + 1 < 10 ? `0${key + 1}` : key + 1} - ${
                        deivce.model
                      }`}
                    </Box>
                  </Box>
                  <Box
                    fontSize={12}
                    css={{ color: "#4B4C56" }}
                    mt={{ xs: 2, md: 0 }}
                  >
                    Latest update : {dateStrAPI(deivce.updated_at)}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box px={{ xs: 0, md: 3 }} width="100%">
                  <Grid item xs={12}>
                    <Grid item xs={12} md={4}>
                      <Box
                        display="flex"
                        width="100%"
                        paddingRight={{ md: 5 }}
                        mb={{ xs: 4, md: 0 }}
                      >
                        <Grid item xs={7}>
                          <DeviceField label="IMEI">{deivce.imei}</DeviceField>
                        </Grid>
                        <Grid item xs={5}>
                          <DeviceField
                            label="Device status"
                            border={{ xs: 0, md: 1 }}
                          >
                            {deivce.device_status === 1 ? (
                              <Box display="flex" alignItems="center">
                                <Box
                                  mr={1}
                                  css={{ color: "#10940E" }}
                                  fontWeight={600}
                                >
                                  Active
                                </Box>
                                <Badge
                                  variant="dot"
                                  classes={{ badge: classes.badgeActive }}
                                  css={{ backgroundColor: "#10940E" }}
                                ></Badge>
                              </Box>
                            ) : (
                              <Box css={{ color: "#B12143" }} fontWeight={600}>
                                Inactive
                              </Box>
                            )}
                          </DeviceField>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        display="flex"
                        width="100%"
                        paddingRight={{ md: 5 }}
                        mb={{ xs: 4, md: 0 }}
                      >
                        <Grid item xs={4}>
                          <DeviceField label="Body temp">
                            <Box fontWeight={600}>{deivce.body_temp}</Box>
                          </DeviceField>
                        </Grid>
                        <Grid item xs={4}>
                          <DeviceField label="Heart rate">
                            <Box fontWeight={600}>{deivce.heart_rate}</Box>
                          </DeviceField>
                        </Grid>
                        <Grid item xs={4}>
                          <DeviceField
                            label="Blood pressure"
                            border={{ xs: 0, md: 1 }}
                          >
                            <Box
                              fontWeight={600}
                            >{`${deivce.blood_systolic}/${deivce.blood_diastolic}`}</Box>
                          </DeviceField>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box display="flex" width="100%" mb={{ xs: 4, md: 0 }}>
                        <Grid item xs={6}>
                          <DeviceField label="Latitude">
                            {deivce.latitude.toFixed(3)}
                          </DeviceField>
                        </Grid>
                        <Grid item xs={6}>
                          <DeviceField
                            label="Longtitude"
                            border={{ xs: 0, md: 1 }}
                          >
                            {deivce.longitude.toFixed(3)}
                          </DeviceField>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box display="flex" width="100%" paddingLeft={{ md: 5 }}>
                        <Grid item xs={6}>
                          <DeviceField label="Battery">
                            {deivce.battery}
                          </DeviceField>
                        </Grid>
                        <Grid item xs={6}>
                          <DeviceField label="Steps">{deivce.step}</DeviceField>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      <Box
        className="justify-between items-center"
        mt={8}
        pb={2}
        display={{ xs: "block", md: "flex" }}
      >
        <Box fontSize="h5.fontSize" fontWeight={500} mb={{ xs: 2, md: 0 }}>
          Health Log
        </Box>
        <Grid item md={4} xs={12}>
          <Grid item xs={6} css={{ padding: "0 5px" }}>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDatePicker
                style={{
                  margin: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                }}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="from"
                inputVariant="outlined"
                label="Date Start"
                autoOk={true}
                value={startDate}
                onChange={(date: MaterialUiPickersDate) => {
                  setStartDate(date ? new Date(date.toString()) : null);
                  onSearch();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6} css={{ padding: "0 5px" }} style={{marginTop:"15px"}}>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <KeyboardDatePicker
                style={{ margin: 0, width: "100%", backgroundColor: "#fff" }}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="to"
                label="Date End"
                inputVariant="outlined"
                value={endDate}
                autoOk={true}
                onChange={(date: MaterialUiPickersDate) => {
                  setEndDate(date ? new Date(date.toString()) : null);
                  onSearch();
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid item md={8} xs={12}>
          <Box
            paddingRight={{ xs: 0, md: 3 }}
            css={{ backgroundColor: "transparent" }}
          >
            <Grid
              item
              xs={12}
              style={{ height: 380, overflow: "hidden", marginBottom: 15 }}
            >
              <BodyTempGraph data={parseData} />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ height: 380, overflow: "hidden", marginBottom: 15 }}
            >
              <HeartRateGraph data={parseData} />
            </Grid>
            <Grid item xs={12} style={{ height: 380, overflow: "hidden" }}>
              <BloodPressureGraph data={parseData} />
            </Grid>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <StickyContainer
            style={{
              width: "100%",
              flex: 1,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Sticky topOffset={-80}>
              {({ style, isSticky }: any) => (
                <div style={style}>
                  <div
                    style={{
                      position: "relative",
                      height: "calc(100vh - 4rem)",
                      top: !isSticky ? 0 : "4rem",
                    }}
                  >
                    <DeviceHistoryDatagrid data={parseData} />
                  </div>
                </div>
              )}
            </Sticky>
          </StickyContainer>
        </Grid>
      </Grid>
      <Box mt={2}>
        <Box
          style={{ height: 400, position: "relative" }}
          css={{ borderRadius: 5, backgroundColor: "#fff" }}
        >
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
                    dot: true,
                  };
                })}
            ></Map>
          )}
        </Box>
      </Box>
    </Container>
  );
});
export const UserPreviewMobile = UserPreview;
