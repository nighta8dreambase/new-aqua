import React, { Fragment, useEffect, useRef, useState } from "react";
import { StickyContainer, Sticky } from "react-sticky";

import RefreshIcon from "@material-ui/icons/Refresh";
import {
  Box,
  Button,
  CardActionArea,
  Container,
  Grid,
  Hidden,
  IconButton,
  LinearProgress,
  Typography,
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

import { dateStr } from "../../utils";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  CardTopTotalUserByGender,
  CardTotalUserByGender,
} from "./CardTotalUserByGender";
import { CardNationality, CardTopNationality } from "./CardNationality";
import { CardAge, CardTopAge } from "./CardAge";
import { CardLengthOfStay, CardTopLengthOfStay } from "./CardLengthOfStay";
import { CardMap, CardMapMemo } from "./CardMap";
import { CardUserList } from "./CardUserList";
import { CardSOS } from "./CardSOS";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import CachedIcon from "@material-ui/icons/Cached";
import { Swiper, SwiperSlide } from "swiper/react";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { Filter } from "../../types/user";
import AddIcon from "@material-ui/icons/Add";

export const SubBar = observer(
  ({
    title,
    back,
    reload,
    viewAll,
    importExcel,
    addNewFence,
  }: {
    title: string | React.ReactElement;
    back?: boolean;
    reload?: boolean;
    viewAll?: string;
    importExcel?: string;
    addNewFence?: string;
  }) => {
    //
    useEffect(() => {
      webStore.setLatestTimeStamp(new Date());
      webStore.resetFilter();
    }, []);
    const history = useHistory();
    return (
      <Box className="flex justify-between items-center" pt={4} pb={0}>
        <Grid item container alignItems="center">
          {back && (
            <IconButton
              onClick={() => {
                const res = history.goBack();
                console.log(res);
              }}
            >
              <ArrowBackIcon css={{ color: "black" }} />
            </IconButton>
          )}

          <Box fontSize="h5.fontSize" fontWeight={500}>
            {title}
          </Box>
        </Grid>
        {reload !== false && (
          <>
            <Box
              display={{ sm: "none", xs: "none", md: "block" }}
              css={{ minWidth: "fit-content" }}
            >
              <Button
                style={{ width: "fit-content" }}
                onClick={() => {
                  webStore.setLatestTimeStamp(new Date());
                }}
                color="inherit"
                startIcon={<CachedIcon />}
              >
                {dateStr(webStore.latestTimeStamp)}
              </Button>
            </Box>
            <Box display={{ xs: "block", md: "none" }}>
              <Button
                style={{ width: "30px", minWidth: "auto" }}
                onClick={() => {
                  webStore.setLatestTimeStamp(new Date());
                }}
              >
                <CachedIcon />
              </Button>
            </Box>
          </>
        )}
        {viewAll && (
          <Button
            color="primary"
            css={{ fontWeight: "bold", width: 150 }}
            href={viewAll}
          >
            View All
          </Button>
        )}
        {importExcel && (
          <Box display={{ sm: "none", xs: "none", md: "block" }} width={200}>
            <Button
              color="primary"
              css={{
                fontWeight: "bold",
                width: 200,
                justifyContent: "flex-end",
              }}
              // onClick={importExcel}
              href={importExcel}
              startIcon={<SaveAltIcon />}
              size="small"
              variant="text"
            >
              IMPORT EXCEL
            </Button>
          </Box>
        )}
        {addNewFence && (
          <Box display="flex" justifyContent="flex-end" className="w-full">
            <Button
              color="primary"
              css={{
                fontWeight: "bold",
                color: "black",
              }}
              startIcon={<AddIcon />}
              size="large"
              variant="text"
              onClick={() => {
                window.open(addNewFence, "_self");
              }}
            >
              ADD NEW FENCE
            </Button>
          </Box>
        )}
      </Box>
    );
  }
);

export const CardTopValue = observer(
  ({
    title,
    value,
    total,
    primary,
  }: {
    title: string;
    value: any;
    total: any;
    primary?: boolean;
  }) => {
    return (
      <Box
        css={{
          display: "flex",
          flex: 1,
          minHeight: "100%",
          borderRadius: 5,
          alignItems: "center",
          backgroundColor: primary ? "var(--primary)" : "#fff",
        }}
      >
        <Box
          px={2}
          py={2.5}
          style={{
            color: primary ? "#fff" : "#000",
            textAlign: primary ? "center" : "left",
          }}
        >
          <Box fontSize={14} fontWeight={600}>
            {title}
          </Box>
          <Box fontSize={27} fontWeight={primary ? 600 : 400}>
            {value}
          </Box>
          <Box
            fontSize={14}
            fontWeight={600}
            css={{ color: primary ? "#fff" : "var(--primary)" }}
          >
            {total}
          </Box>
        </Box>
      </Box>
    );
  }
);

export const Dashboard = () => {
  useEffect(() => {
    return () => {
      webStore.resetFilter();
    };
  }, []);
  const mapRef = useRef<any>();
  const [page, setPage] = useState<number>(1);
  const filter: Filter = {
    startDate: webStore.startDate || new Date(),
    endDate: webStore.endDate || new Date(),
    filter_temp: webStore.filter_temp,
    filter_wear: webStore.filter_wear,
    filter_battery: webStore.filter_battery,
    filter_yacht_name: webStore.filter_yacht_name,
    page: page,
    perPage: 10,
  };
  const { result_userList, loading_userList, total } = useListUser(filter);
  // console.log("Dashboard", result_userList);
  return (
    <Container maxWidth="xl" style={{ maxWidth: 1500 }} className="py-4 pb-16">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SubBar title={"Summary"} />
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <CardTotalUserByGender />
            </Grid>
            <Grid
              style={{
                minHeight: "100%",
                flex: 1,
                display: "flex",
              }}
              item
              xs={9}
            >
              <Grid
                container
                style={{
                  minHeight: "100%",
                  flex: 1,
                  display: "flex",
                }}
                spacing={1}
              >
                <Grid item xs={6}>
                  <CardNationality />
                </Grid>
                <Grid item xs={6}>
                  <CardAge />
                </Grid>
                <Grid
                  item
                  style={{
                    display: "flex",
                  }}
                  xs={12}
                >
                  <Grid
                    container
                    style={{
                      minHeight: "100%",
                      flex: 1,
                    }}
                    spacing={1}
                  >
                    <Grid item xs={4}>
                      <CardTopNationality />
                    </Grid>
                    <Grid item xs={4}>
                      <CardTopAge />
                    </Grid>
                    <Grid item xs={4}>
                      <CardTopLengthOfStay />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0, flex: 1 }}>
          <Grid
            container
            style={{
              minHeight: "100%",
              flex: 1,
            }}
            spacing={1}
          >
            <Grid item xs={7}>
              <CardLengthOfStay />
            </Grid>
            <Grid item xs={5}>
              <CardSOS />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={1}>
          <Grid item md={6} xs={12}>
            <SubBar title={"Users"} reload={false} viewAll={"user/list"} />
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item xs={6}>
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
            xs={6}
            style={{
              width: "100%",
              flex: 1,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
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
                        top: !isSticky ? 0 : "4rem",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
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
    </Container>
  );
};

export const DashboardMobile = () => {
  const [page, setPage] = useState<number>(1);
  const filter: Filter = {
    startDate: webStore.startDate || new Date(),
    endDate: webStore.endDate || new Date(),
    filter_temp: webStore.filter_temp,
    filter_wear: webStore.filter_wear,
    filter_battery: webStore.filter_battery,
    filter_yacht_name: webStore.filter_yacht_name,
    page: page,
    perPage: 10,
  };
  const { result_userList, loading_userList, total } = useListUser(filter);
  return (
    <Container maxWidth="lg" className="pb-8">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubBar title={"Summary"} />
        </Grid>
        <Grid item xs={12}>
          <Swiper
            spaceBetween={5}
            slidesPerView="auto"
            // slidesPerView={2}
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
          >
            <SwiperSlide style={{ width: "60%" }}>
              <CardTopTotalUserByGender />
            </SwiperSlide>
            <SwiperSlide style={{ width: "60%" }}>
              <CardTopNationality />
            </SwiperSlide>
            <SwiperSlide style={{ width: "60%" }}>
              <CardTopAge />
            </SwiperSlide>
            <SwiperSlide style={{ width: "80%" }}>
              <CardTopLengthOfStay />
            </SwiperSlide>
          </Swiper>
        </Grid>
        <Grid item xs={12}>
          <SubBar title={"Breakdown"} reload={false} />
        </Grid>
        <Grid item xs={12}>
          <CardTotalUserByGender />
        </Grid>
        <Grid item xs={12}>
          <CardNationality />
        </Grid>
        <Grid item xs={12}>
          <CardAge />
        </Grid>
        <Grid item xs={12}>
          <CardLengthOfStay />
        </Grid>
        <Grid item xs={12}>
          <CardSOS />
        </Grid>
        <Grid item xs={12}>
          <SubBar title={"Users"} reload={false} viewAll={"user/list"} />
        </Grid>
        <Grid item xs={12}>
          <CardUserList
            result_userList={result_userList}
            loading_userList={loading_userList}
            total={total}
            filter={filter}
            setPage={setPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
