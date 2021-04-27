import React, { useEffect } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { useListPushData } from "../../services/api/setting/useListPushData";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import edit from "../../components/assets/edit.svg";
import remove from "../../components/assets/remove.svg";
import { useHistory } from "react-router-dom";

export const PushData = observer((props: any) => {
  const mobile = webStore.device === "mobile";
  const history = useHistory();

  const { result: datasource, loading, error } = useListPushData();

  return mobile ? (
    <PushDataMobile
      datasource={datasource}
      loading={loading}
      history={history}
    />
  ) : (
    <PushDataDesktop
      datasource={datasource}
      loading={loading}
      history={history}
    />
  );
});

export const PushDataDesktop = observer((props: any) => {
  return (
    <Container maxWidth="xl" className="py-4">
      <Grid container spacing={3}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Box mb={2}>
            <SubBar back={true} reload={false} title={"Push Data"} />
          </Box>
          <Box mb={2}>
            <Button
              startIcon={<AddIcon css={{ color: "var(--primary)" }} />}
              onClick={() => {
                props.history.push("/setting/pushdata/create");
              }}
            >
              <Box fontWeight="600" css={{ color: "var(--primary)" }}>
                ADD PUSH DATA
              </Box>
            </Button>
          </Box>
          <Grid item xs={12} justify="center">
            {props.loading ? (
              <CircularProgress css={{ color: "var(--primary)" }} />
            ) : props.datasource && props.datasource.length > 0 ? (
              props.datasource &&
              props.datasource.map((d: any, i: any) => {
                return (
                  <Grid item xs={12} key={i}>
                    <PushDataCard {...d} />
                  </Grid>
                );
              })
            ) : (
              <Box fontSize={14} fontWeight={600} p={4}>
                There are no push data
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

export const PushDataMobile = observer((props: any) => {
  return (
    <Container maxWidth="xl" className="py-4">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mb={2}>
            <SubBar back={true} reload={false} title={"Push Data"} />
          </Box>
          <Box mb={2}>
            <Button
              startIcon={<AddIcon css={{ color: "var(--primary)" }} />}
              onClick={() => {
                props.history.push("/setting/pushdata/create");
              }}
            >
              <Box fontWeight="600" css={{ color: "var(--primary)" }}>
                ADD PUSH DATA
              </Box>
            </Button>
          </Box>
          <Grid item xs={12} justify="center">
            {props.loading ? (
              <CircularProgress css={{ color: "var(--primary)" }} />
            ) : props.datasource && props.datasource.length > 0 ? (
              props.datasource &&
              props.datasource.map((d: any, i: any) => {
                return (
                  <Grid item xs={12} key={i}>
                    <PushDataCard {...d} mobile={true} />
                  </Grid>
                );
              })
            ) : (
              <Box fontSize={14} fontWeight={600} p={4}>
                There are no push data
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

export const PushDataCard = observer((props: any) => {
  const pushDataStatus = [
    { key: "SENDED", color: "var(--success)", wording: "Sended" },
    { key: "SCHEDULE", color: "var(--warning)", wording: "Schedule" },
  ];

  const status = pushDataStatus.find((d, i) => {
    return d.key === props.status;
  });
  return props.mobile ? (
    <PushDataCardMobile {...props} status={status} />
  ) : (
    <PushDataCardDesktop {...props} status={status} />
  );
});

export const PushDataCardDesktop = observer((props: any) => {
  const status = props.status;
  return (
    <Box mb={2}>
      <Paper>
        <Box pt={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
          >
            <Box display="flex" alignItems="center">
              <div
                css={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "99px",
                  backgroundColor: status?.color,
                }}
              ></div>
              <Box
                fontSize={12}
                ml={1}
                fontWeight="500"
                css={{ color: status?.color }}
              >
                {status?.wording}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box mr={2} css={{ cursor: "pointer" }}>
                <img src={remove} alt="remove" />
              </Box>
              <Box css={{ cursor: "pointer" }}>
                <img src={edit} alt="edit" />
              </Box>
            </Box>
          </Box>
          <Box fontSize={14} mt={4} display="flex" px={3} pb={2}>
            <Grid item xs={2} css={{ color: "var(--hard-gray)" }}>
              Device
            </Grid>
            <Grid item xs={10}>
              {props.devices &&
                props.devices.map((d: any, i: any) => {
                  return (
                    <Box key={i} css={{ color: "var(--primary)" }} mr={1}>
                      {d}
                    </Box>
                  );
                })}
            </Grid>
          </Box>
          <Divider />
          <Box fontSize={14} mt={2} display="flex" px={3} pb={2}>
            <Grid item xs={2} css={{ color: "var(--hard-gray)" }}>
              Message
            </Grid>
            <Grid item xs={10}>
              {props.message}
            </Grid>
          </Box>
          <Divider />
          <Box
            fontSize={14}
            mt={2}
            display="flex"
            px={3}
            pb={2}
            alignItems="center"
          >
            <Grid item xs={2} css={{ color: "var(--hard-gray)" }}>
              Time
            </Grid>
            <Grid item xs={7} wrap="wrap">
              {props.time}
            </Grid>
            {status && status.key === "SENDED" ? (
              <Grid
                item
                xs={3}
                css={{ color: "var(--hard-gray)" }}
                justify="flex-end"
              >
                <Box
                  css={{
                    color: "var(--primary)",
                    textTransform: "none",
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                  View Report{" "}
                  <ChevronRightIcon css={{ color: "var(--primary)" }} />
                </Box>
              </Grid>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
});

export const PushDataCardMobile = observer((props: any) => {
  const status = props.status;
  return (
    <Box mb={2}>
      <Paper>
        <Box pt={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
          >
            <Box display="flex" alignItems="center">
              <div
                css={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "99px",
                  backgroundColor: status?.color,
                }}
              ></div>
              <Box
                fontSize={12}
                ml={1}
                fontWeight="500"
                css={{ color: status?.color }}
              >
                {status?.wording}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box mr={2} css={{ cursor: "pointer" }}>
                <img src={remove} alt="remove" />
              </Box>
              <Box css={{ cursor: "pointer" }}>
                <img src={edit} alt="edit" />
              </Box>
            </Box>
          </Box>
          <Box fontSize={14} mt={4} display="flex" px={3} pb={2}>
            <Grid item xs={4} css={{ color: "var(--hard-gray)" }}>
              Device
            </Grid>
            <Grid item xs={8}>
              {props.devices &&
                props.devices.map((d: any, i: any) => {
                  return (
                    <Box key={i} css={{ color: "var(--primary)" }} mr={1}>
                      {d}
                    </Box>
                  );
                })}
            </Grid>
          </Box>
          <Divider />
          <Box fontSize={14} mt={2} display="flex" px={3} pb={2}>
            <Grid item xs={4} css={{ color: "var(--hard-gray)" }}>
              Message
            </Grid>
            <Grid item xs={8}>
              {props.message}
            </Grid>
          </Box>
          <Divider />
          <Box
            fontSize={14}
            mt={2}
            display="flex"
            px={3}
            pb={2}
            alignItems="center"
          >
            <Grid item xs={4} css={{ color: "var(--hard-gray)" }}>
              Time
            </Grid>
            <Grid item xs={8}>
              {props.time}
            </Grid>
          </Box>
          <Box>
            {status && status.key === "SENDED" ? (
              <>
                <Divider />
                <Box px={3} py={2} fontSize={14}>
                  <Grid
                    item
                    xs={12}
                    css={{ color: "var(--hard-gray)" }}
                    justify="center"
                  >
                    <Box
                      css={{
                        color: "var(--primary)",
                        textTransform: "none",
                        userSelect: "none",
                        cursor: "pointer",
                      }}
                    >
                      View Report{" "}
                      <ChevronRightIcon css={{ color: "var(--primary)" }} />
                    </Box>
                  </Grid>
                </Box>
              </>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
});
