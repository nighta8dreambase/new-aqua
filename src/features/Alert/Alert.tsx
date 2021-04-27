import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import { CardSOS } from "../Dashboard/CardSOS";
import { CardUserList } from "../Dashboard/CardUserList";
import { Filter } from "../../types/user";
import { webStore } from "../../stores/webStore";
import { useListUser } from "../../services/api/user/useListUser";
import { StickyContainer, Sticky } from "react-sticky";
import { CardMapMemo } from "../Dashboard/CardMap";
import MapIcon from "@material-ui/icons/Map";

export const Alert = observer((props: any) => {
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
    filter_Keyword: webStore.filter_Keyword,
    page: page,
    perPage: 10,
  };
  const { result_userList, loading_userList, total } = useListUser(filter);

  return (
    <Container maxWidth="xl" style={{ maxWidth: 1500 }} className="py-4 pb-16">
      <Box mb={2}>
        <Grid item xs={12}>
          <SubBar title={"SOS Alert"} reload={false} />
        </Grid>
      </Box>
      <Grid item xs={12}>
        <CardSOS fullDetail={true} />
      </Grid>
      {/* hidden Out of geofence */}
      <Box display="none">
        <Box mb={2}>
          <Grid item xs={12}>
            <SubBar title={"Out of geofence"} reload={false} />
          </Grid>
        </Box>
        <Grid item xs={12}>
          {/* spacing={1} */}
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
            xs={12}
            md={6}
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
      </Box>
    </Container>
  );
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export const AlertMobile = observer((props: any) => {
  const [vTab, setTab] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  const mapRef = useRef<any>();
  const [page, setPage] = useState<number>(1);
  const filter: Filter = {
    startDate: webStore.startDate || new Date(),
    endDate: webStore.endDate || new Date(),
    filter_temp: webStore.filter_temp,
    filter_wear: webStore.filter_wear,
    filter_battery: webStore.filter_battery,
    filter_yacht_name: webStore.filter_yacht_name,
    filter_Keyword: webStore.filter_Keyword,
    page: page,
    perPage: 10,
  };
  const { result_userList, loading_userList, total } = useListUser(filter);

  return (
    <>
      <Paper square>
        <Tabs
          value={vTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="SOS" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Geofence" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Paper>
      <TabPanel value={vTab} index={0}>
        <CardSOS fullDetail={true} />
      </TabPanel>
      <TabPanel value={vTab} index={1}>
        <Button
          variant="text"
          css={{
            padding: 8,
            minWidth: "unset",
            position: "absolute",
            top: 5,
            right: 10,
          }}
        >
          <MapIcon css={{ color: "#4684E2" }} />
        </Button>
        {/* hidden Out of geofence */}
        <Box display="none">
          <CardUserList
            result_userList={result_userList}
            loading_userList={loading_userList}
            total={total}
            filter={filter}
            setPage={setPage}
            mapRef={mapRef}
          />
        </Box>
      </TabPanel>
    </>
  );
});
