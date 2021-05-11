import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  Box,
  Container,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  makeStyles,
  withStyles,
  InputBase,
} from "@material-ui/core";
import { CardMap, CardMapMemo } from "../Dashboard/CardMap";
import { CardUserList } from "../Dashboard/CardUserList";
import { SubBar } from "../Dashboard/Dashboard";
import LuxonUtils from "@date-io/luxon";
import { DateFilter } from "../../components/DateFilter";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { StickyContainer, Sticky } from "react-sticky";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { webStore } from "../../stores/webStore";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";
import MapIcon from "@material-ui/icons/Map";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Filter } from "../../types/user";
import { useListAllUser } from "../../services/api/user/useListAllUser";
import { usePlace } from "../../services/api/Options/usePlace";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { SwiperUserLists } from "../UserManage/SwiperUserLists";

const UserFilter = observer(({ display = true }: { display?: boolean }) => {
  const [startDate, setStartDate] = useState<Date | null>(webStore.startDate);
  const [endDate, setEndDate] = useState<Date | null>(webStore.endDate);
  const [filterHour, setFilterHour] = useState<number | null>(
    webStore.filter_hour
  );
  const [filterTemperature, setFilterTemperature] = useState<string | null>(
    webStore.filter_temp || ""
  );
  const [filterWearing, setFilterWearing] = useState<string | null>(
    webStore.filter_wear || ""
  );
  const [filterBattery, setFilterBattery] = useState<string | null>(
    webStore.filter_battery || ""
  );
  const [filterYachtName, setFilterYachtName] = useState<string | null>(
    webStore.filter_yacht_name || ""
  );
  // เพิ่ม
  const [filterKeyword, setFilterKeyword] = useState<string | null>(
    webStore.filter_Keyword || ""
  );
  // เพิ่ม
  const [filterGeoFence, setFilterGeoFence] = useState<string | null>(
    webStore.filter_geo_fence || ""
  );

  // const [filterHour, setFilterHour] = useState<number | null>(
  //   webStore.filter_hour
  // );

  const TempOptions = [
    { value: "high", label: "High >37.8" },
    { value: "warning", label: "Warning 37.5 - 37.8" },
    { value: "normal", label: "Normal <=37.5" },
  ];

  const WearingOptions = [
    { value: "24", label: ">= 20 hour" },
    { value: "19", label: "15 - 19 hour" },
    { value: "15", label: "10 - 14 hour" },
    { value: "9", label: "5 - 9 hour" },
    { value: "5", label: "< 5 hour" },
  ];

  const BatteryOptions = [
    // { value: "10", label: ">= 80%" },
    // { value: "8", label: "60 - 79%" },
    // { value: "6", label: "40 - 59%" },
    // { value: "4", label: "20 - 39%" },
    { value: "4", label: "76 - 100%" },
    { value: "3", label: "51 - 75%" },
    { value: "2", label: "26 - 50%" },
    { value: "1", label: "16 - 25%" },
    { value: "-0", label: "1 - 15%" },
    { value: "-1", label: "Turn off (including out of battery and charging)" },
  ];

  const { result_places, loading_places, error_places } = usePlace();

  useEffect(() => {
    // console.log("changee");
    webStore.setStartDate(startDate);
    webStore.setEndDate(endDate);
    webStore.set_filter_temp(filterTemperature);
    webStore.set_filter_wear(filterWearing);
    webStore.set_filter_battery(filterBattery);
    webStore.set_filter_yacht_name(filterYachtName);
    webStore.set_filter_Keyword(filterKeyword);
    webStore.set_filter_geo_fence(filterGeoFence);
    // webStore.set_filter_hour(filterHour);
  }, [
    startDate,
    endDate,
    filterTemperature,
    filterWearing,
    filterBattery,
    filterYachtName,
    filterKeyword,
    filterGeoFence,
  ]);

  return (
    <Box mb={3}>
      {display && (
        <>
          <Box
            display="flex"
            py={2}
            css={{
              fontSize: 13,
              borderRadius: 5,
              backgroundColor: "#fff",
              "@media (max-width: 992px)": {
                flexFlow: "wrap",
                backgroundColor: "transparent",
              },
            }}
          >
            <Box
              borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              display="flex"
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                },
              }}
            >
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <KeyboardDatePicker
                  style={{
                    margin: 0,
                    width: "100%",
                    borderWidth: 0,
                    fontSize: 13,
                  }}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="from"
                  label="Date Start"
                  autoOk={true}
                  value={startDate || new Date()}
                  onChange={(date: MaterialUiPickersDate) => {
                    setStartDate(date ? new Date(date.toString()) : null);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box
              borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              display="flex"
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                  borderWidth: 0,
                },
              }}
            >
              <MuiPickersUtilsProvider utils={LuxonUtils}>
                <KeyboardDatePicker
                  style={{ margin: 0, width: "100%", fontSize: 13 }}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="to"
                  label="Date End"
                  autoOk={true}
                  value={endDate || new Date()}
                  onChange={(date: MaterialUiPickersDate) => {
                    setEndDate(date ? new Date(date.toString()) : null);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box
              display="flex"
              borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                },
              }}
            >
              <FormControl css={{ width: "100%" }}>
                <InputLabel id="filterTem-label">Temperature</InputLabel>
                <Select
                  value={filterTemperature}
                  disableUnderline
                  css={{ fontFamily: "inherit", fontSize: "inherit" }}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterTemperature(event.target.value as string);
                  }}
                  labelId="filterTem-label"
                >
                  {TempOptions.map((v) => {
                    return <MenuItem value={v.value}>{v.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                  borderWidth: 0,
                },
              }}
            >
              <FormControl css={{ width: "100%" }}>
                <InputLabel id="filterWearing-label">Device wearing</InputLabel>
                <Select
                  value={filterWearing}
                  disableUnderline
                  css={{ fontFamily: "inherit", fontSize: "inherit" }}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterWearing(event.target.value as string);
                  }}
                  labelId="filterWearing-label"
                >
                  {WearingOptions.map((v) => {
                    return <MenuItem value={v.value}>{v.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                },
              }}
            >
              <FormControl css={{ width: "100%" }}>
                <InputLabel id="filterBattery-label">Battery</InputLabel>
                <Select
                  value={filterBattery}
                  disableUnderline
                  css={{ fontFamily: "inherit", fontSize: "inherit" }}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterBattery(event.target.value as string);
                  }}
                  labelId="filterBattery-label"
                >
                  {BatteryOptions.map((v) => {
                    return <MenuItem value={v.value}>{v.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              // borderRight="1px solid #ddd"
              px={2}
              mb={{ xs: 3, md: 0 }}
              justifyContent="center"
              width="100%"
              css={{
                height: "48px",
                "@media (max-width: 992px)": {
                  width: "50%",
                  borderWidth: 0,
                },
              }}
            >
              <FormControl css={{ width: "100%" }}>
                <InputLabel id="filterYachtName-label">Place Name</InputLabel>
                <Select
                  value={filterYachtName}
                  disableUnderline
                  css={{ fontFamily: "inherit", fontSize: "inherit" }}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setFilterYachtName(event.target.value as string);
                  }}
                  labelId="filterYachtName-label"
                >
                  {result_places.map((v) => {
                    return <MenuItem value={`${v.id}`}>{v.name_en}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
            {/* <Box display="flex" px={2} justifyContent="center" width="100%">
                <FormControl css={{ width: "100%" }}>
                  <InputLabel id="filterGeoFence-label">GEO Fence</InputLabel>
                  <Select
                    value={filterGeoFence}
                    disableUnderline
                    css={{ fontFamily: "inherit", fontSize: "inherit" }}
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>
                    ) => {
                      setFilterGeoFence(event.target.value as string);
                    }}
                    labelId="filterGeoFence-label"
                  >
                    <MenuItem value="GEO_fence">GEO Fence</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}
          </Box>
          <Box textAlign="right">
            <Button
              color="primary"
              css={{ fontSize: 13 }}
              onClick={() => {
                webStore.setStartDate(null);
                webStore.setEndDate(null);
                webStore.set_filter_hour(null);
                webStore.set_filter_temp(null);
                webStore.set_filter_wear(null);
                webStore.set_filter_battery(null);
                webStore.set_filter_yacht_name(null);
                webStore.set_filter_Keyword(null);
                webStore.set_filter_geo_fence(null);

                setStartDate(webStore.startDate);
                setEndDate(webStore.endDate);
                setFilterHour(webStore.filter_hour);
                setFilterTemperature(webStore.filter_temp);
                setFilterWearing(webStore.filter_wear);
                setFilterBattery(webStore.filter_battery);
                setFilterYachtName(webStore.filter_yacht_name);
                setFilterKeyword(webStore.filter_Keyword);
                setFilterGeoFence(webStore.filter_geo_fence);
              }}
            >
              Clear all filter
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
});

const UserSearch = observer(
  ({
    keywordsearch,
    setKeywordsearch,
    displayFilter,
    setDisplayFilter,
    inputWidthMobile,
  }: {
    inputWidthMobile?: number;
    keywordsearch: String;
    setKeywordsearch: (event: any) => void;
    displayFilter: boolean;
    setDisplayFilter: (e: boolean) => void;
  }) => {
    
    return (
      <Box css={{ backgroundColor: "#fff" }} p={1} borderRadius={2}>
        <InputBase
          placeholder="Customer name or IMEI or Passport"
          value={keywordsearch}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            setKeywordsearch(event.target.value as string);
          }}
          css={{
            width: 300,
            padding: "8px 15px",
            "@media (max-width: 992px)": {
              fontSize: 12,
              width: inputWidthMobile ? inputWidthMobile : 235,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("search");
          }}
          css={{
            padding: 8,
            minWidth: "unset",
            boxShadow: "unset",
          }}
        >
          <SearchIcon />
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setDisplayFilter(displayFilter ? false : true);
          }}
          css={{
            padding: 8,
            minWidth: "unset",
            boxShadow: "unset",
            borderLeft: "1px solid #ddd",
            borderRadius: 0,
            marginLeft: 10,
            "@media (min-width: 991px)": {
              display: "none",
            },
          }}
        >
          <FilterListIcon />
        </Button>
      </Box>
    );
  }
);

export const UserList = observer(() => {
  const history = useHistory();
  const [displayFilter, setDisplayFilter] = useState<boolean>(false);
  const [displayUserLocation, setDisplayUserLocation] = useState<boolean>(
    false
  );
  const [keywordsearch, setKeywordsearch] = useState(String);
  const mapRef = useRef<any>();
  const [page, setPage] = useState<number>(1);
  const filter: Filter = {
    startDate: webStore.startDate || new Date(),
    endDate: webStore.endDate || new Date(),
    filter_temp: webStore.filter_temp,
    filter_wear: webStore.filter_wear,
    filter_battery: webStore.filter_battery,
    filter_yacht_name: webStore.filter_yacht_name,
    filter_Keyword: keywordsearch,
    page: page,
    perPage: 10,
  };
  // console.log("filterS",filter.filter_battery);
  const { result_userList, loading_userList, total } = useListAllUser(filter);
  
  return (
    <Container maxWidth="xl" className="py-4">
      <Grid container>
        <Grid item xs={12}>
          <Box
            className="flex justify-between items-center flex-wrap"
            pt={4}
            mb={3}
          >
            <Box
              display="flex"
              alignItems="center"
              css={{
                "@media (max-width: 992px)": {
                  width: "100%",
                  justifyContent: "space-between",
                },
              }}
              mb={{ xs: 3, md: 0 }}
            >
              <Box fontSize="h5.fontSize" fontWeight={500} mr={3}>
                User List
              </Box>
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    history.push("/user/create");
                  }}
                  css={{
                    "@media (max-width: 992px)": {
                      backgroundColor: "transparent",
                      boxShadow: "unset",
                      color: "#4684E2",
                    },
                  }}
                >
                  Add user
                </Button>
                <Box
                  display={{ xs: "block", md: "none" }}
                  borderLeft="1px solid rgba(0, 0, 0, 0.1)"
                >
                  <Button
                    variant="text"
                    css={{
                      padding: 8,
                      minWidth: "unset",
                    }}
                    onClick={() => {
                      setDisplayUserLocation(true);
                    }}
                  >
                    <MapIcon css={{ color: "#4684E2" }} />
                  </Button>
                </Box>
              </Box>
            </Box>
            <UserSearch
              keywordsearch={keywordsearch}
              setKeywordsearch={setKeywordsearch}
              displayFilter={displayFilter}
              setDisplayFilter={setDisplayFilter}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box display={{ xs: "none", md: "block" }}>
            <UserFilter />
          </Box>
          <Box display={{ xs: "block", md: "none" }}>
            <UserFilter display={displayFilter} />
          </Box>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <CardUserList
              result_userList={result_userList}
              loading_userList={loading_userList}
              total={total}
              filter={filter}
              setPage={setPage}
              mapRef={mapRef}
            />
          </Grid>
          <Grid
            item
            md={6}
            css={{
              width: "100%",
              flex: 1,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              "@media (max-width: 992px)": {
                display: "none",
              },
            }}
          >
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
                        height: "auto",
                        position: "relative",
                        minHeight: "calc(100vh - 4rem)",
                        display: "flex",
                        flexDirection: "column",
                        top: !isSticky ? 0 : "4rem",
                      }}
                    >
                      <CardMapMemo
                        mapRef={mapRef}
                        result_userList={result_userList}
                        loading_userList={loading_userList}
                        page={filter.page}
                        perPage={filter.perPage}
                      />
                    </div>
                  </div>
                )}
              </Sticky>
            </StickyContainer>
          </Grid>
        </Grid>
      </Grid>
      {displayUserLocation && (
        <Grid
          container
          className="fixed w-screen h-screen left-0 top-0"
          style={{ zIndex: 9991 }}
        >
          <Box className="absolute w-full z-10 ">
            <Box className="flex justify-center items-center bg-white">
              <Button
                variant="text"
                onClick={() => {
                  setDisplayUserLocation(false);
                }}
                css={{
                  padding: "8px 8px 8px 15px",
                  minWidth: "unset",
                  boxShadow: "unset",
                  borderRight: "1px solid #ddd",
                  borderRadius: 0,
                }}
              >
                <ArrowBackIosIcon style={{ width: 20 }} />
              </Button>
              <UserSearch
                inputWidthMobile={220}
                keywordsearch={keywordsearch}
                setKeywordsearch={setKeywordsearch}
                displayFilter={displayFilter}
                setDisplayFilter={setDisplayFilter}
              />
            </Box>
            <Box className="bg-white">
              <UserFilter display={displayFilter} />
            </Box>
          </Box>
          <CardMapMemo
            mapRef={mapRef}
            result_userList={result_userList}
            loading_userList={loading_userList}
            page={filter.page}
            perPage={filter.perPage}
            loadmore={true}
          />
          <Box className="absolute w-full z-10 bottom-0">
            <SwiperUserLists
              result_userList={result_userList}
              loading_userList={loading_userList}
              total={total}
              filter={filter}
              setPage={setPage}
              mapRef={mapRef}
            />
          </Box>
        </Grid>
      )}
    </Container>
  );
});
export const UserListMobile = UserList;
