import React, { Fragment, useEffect } from "react";
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
  Divider,
} from "@material-ui/core";
import { webStore } from "../../stores/webStore";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import classes from "*.module.css";
import { useReadUserByGender } from "../../services/api/dashboard_report/useReadUserByGender";
import { Doughnut } from "react-chartjs-2";
import { GRAPH_COLOR } from "../../data/graphColor";
import { PaginationItem, Pagination } from "@material-ui/lab";
import { CardTopValue } from "./Dashboard";

export interface customeLabels {
  data: any;
  labels: any;
  color: any;
  showValue?: boolean;
  itemsCountPerPage?: number;
}

export const CustomeLabels = observer(
  ({
    data,
    labels = [],
    color = GRAPH_COLOR,
    showValue = false,
    itemsCountPerPage = 10,
  }: customeLabels) => {
    const [page, setPage] = React.useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
    const pageCount = Math.ceil(data.length / itemsCountPerPage);
    let sum = data.reduce((a: any, b: any) => a + b, 0);
    return (
      <>
        {labels.map((label: string, key: number) => {
          return (
            <Box
              css={{
                display:
                  key >= itemsCountPerPage * (page - 1) &&
                  key < itemsCountPerPage * page
                    ? "block"
                    : "none",
              }}
            >
              <Box py={1.5} px={{ xs: 4, md: 0 }}>
                <Grid
                  container
                  css={{
                    padding: "0.5em 0",
                  }}
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item direction="row" alignItems="center" xs={9}>
                    <Box
                      css={{
                        width: 10,
                        height: 10,
                        backgroundColor: color[key],
                        borderRadius: "100%",
                      }}
                      mr={1}
                    ></Box>
                    <Box css={{ color: "#5A5A68" }}>{label}</Box>
                  </Grid>
                  <Grid item xs={3}>
                    {showValue ? (
                      <Box textAlign="right">
                        <Box
                          css={{
                            fontWeight: 700,
                            fontSize: "1.2em",
                            lineHeight: "1em",
                          }}
                        >{`${Math.round((data[key] * 100) / sum)}%`}</Box>
                        <Box
                          css={{
                            color: "#5A5A68",
                            fontSize: "1em",
                            lineHeight: "1em",
                            marginTop: "0.25em",
                          }}
                        >
                          {data[key]}
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        textAlign="right"
                        css={{ color: "#5A5A68", fontWeight: 700 }}
                      >{`${Math.round((data[key] * 100) / sum)}%`}</Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
              {key < labels.length - 1 && <Divider />}
            </Box>
          );
        })}
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChange}
            renderItem={(item) => {
              if (item.type == "previous") {
                return (
                  <>
                    <PaginationItem {...item} />
                    <Box display="inline" mx={1}>{`${page}/${pageCount}`}</Box>
                  </>
                );
              } else if (item.type == "next") {
                return <PaginationItem {...item} />;
              } else {
                return;
              }
            }}
            css={{ justifyContent: "center" }}
          />
        )}
      </>
    );
  }
);

export const CustomeLabelsMobile = observer(
  ({
    data,
    labels = [],
    color = GRAPH_COLOR,
    showValue = false,
    itemsCountPerPage = 10,
  }: customeLabels) => {
    let sum = data.reduce((a: any, b: any) => a + b, 0);
    return (
      <>
        {labels.map((label: string, key: number) => {
          return (
            <Box my={2}>
              <Grid direction="row" container>
                <Box
                  css={{
                    width: 10,
                    height: 10,
                    backgroundColor: color[key],
                    borderRadius: "100%",
                    marginTop: "0.5em",
                  }}
                  mr={1}
                ></Box>
                <Box>
                  <Box css={{ color: "#5A5A68" }} fontSize={14}>
                    {label}
                  </Box>
                  <Box
                    css={{
                      fontWeight: 700,
                      fontSize: "1.6em",
                      color: "#5A5A68",
                    }}
                  >{`${Math.round((data[key] * 100) / sum)}%`}</Box>
                </Box>
              </Grid>
            </Box>
          );
        })}
      </>
    );
  }
);

export const CardTotalUserByGender = observer(() => {
  const { result_user_by_gender, loading_user_by_gender } = useReadUserByGender(
    webStore.latestTimeStamp
  );

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        minHeight: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        backgroundColor: "#fff",
      }}
    >
      {loading_user_by_gender && (
        <LinearProgress
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        />
      )}
      <Box style={{ width: "100%" }} p={2}>
        <Box display={{ sm: "none", xs: "none", md: "block" }}>
          <Typography gutterBottom>
            <Box fontWeight="bold" textAlign="center">
              Total customers
            </Box>
            <Box
              fontWeight="bold"
              textAlign="center"
              lineHeight={"56px"}
              fontSize={48}
            >
              {result_user_by_gender?.total}
            </Box>
            <Box
              fontWeight="bold"
              textAlign="center"
              mb={3}
              css={{ color: "#14AF5C" }}
            >
              +5% from previous week
            </Box>
          </Typography>
        </Box>
        <Box display={{ xs: "block", md: "none" }}>
          <Typography style={{ fontWeight: "bold" }}>Gender</Typography>
        </Box>
        <Grid container>
          <Grid item md={12} xs={9}>
            <Doughnut
              height={200}
              legend={{ position: "bottom" }}
              data={{
                datasets: [
                  {
                    data: [
                      result_user_by_gender?.male,
                      result_user_by_gender?.female,
                    ],
                    backgroundColor: GRAPH_COLOR,
                  },
                ],
              }}
              options={{
                tooltips: {
                  callbacks: {
                    label: (tooltipItem: any, data: any) => {
                      return ` ${["Male", "Female"][tooltipItem.index]} ${
                        data.datasets[0].data[tooltipItem.index]
                      }`;
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid item md={12} xs={3}>
            <Box display={{ sm: "none", xs: "none", md: "block" }}>
              <CustomeLabels
                data={[
                  result_user_by_gender?.male,
                  result_user_by_gender?.female,
                ]}
                labels={["Male", "Female"]}
                color={GRAPH_COLOR}
                showValue={true}
              />
            </Box>
            <Box display={{ sm: "block", xs: "block", md: "none" }}>
              <CustomeLabelsMobile
                data={[
                  result_user_by_gender?.male,
                  result_user_by_gender?.female,
                ]}
                labels={["Male", "Female"]}
                color={GRAPH_COLOR}
                showValue={true}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});

export const CardTopTotalUserByGender = observer(() => {
  const { result_user_by_gender, loading_user_by_gender } = useReadUserByGender(
    webStore.latestTimeStamp
  );
  return (
    <CardTopValue
      title="Total customers"
      value={result_user_by_gender?.total}
      total={`+5% from previous week`}
      primary={true}
    />
  );
});
