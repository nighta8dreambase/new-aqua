import { useSnackbar } from "notistack";
import React, { useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { observer } from "mobx-react-lite";
import _ from "lodash";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";

const OtpTextField = ({ index, form, setForm }: any) => {
  const onKeydown = (e: any) => {
    console.log(e.code, e.target.value);
    if (
      e.code === "Backspace" &&
      (!e.target.value || e.target.value.length === 0)
    ) {
      let cur = parseInt(e.target.name.replace("number", ""));
      let focus = "number" + (cur - 1);
      if (document.getElementsByName(focus)[0]) {
        document.getElementsByName(focus)[0].focus();
      }
    }
  };
  const onChange = (e: any) => {
    if (e.target.name) {
      let newV = { ...form };
      let cur = parseInt(e.target.name.replace("number", ""));
      let focusNext = e.target.value !== null && e.target.value.length > 0;
      let next = "number" + (cur + 1);
      let prev = "number" + (cur - 1);
      let focus = focusNext ? next : prev;
      if (e.target.value.toString()[1]) {
        newV[next] = e.target.value.toString()[1];
      }
      newV[e.target.name] = e.target.value.toString()[0];

      setForm(newV);
      if (document.getElementsByName(focus)[0]) {
        document.getElementsByName(focus)[0].focus();
      }
    }
  };
  return (
    <Grid item xs={2}>
      <TextField
        autoFocus={index === 0}
        inputProps={{
          min: 0,
          style: { textAlign: "center" },
        }}
        onChange={onChange}
        onKeyDown={onKeydown}
        value={form["number" + index] || ""}
        // className="w-full"
        // size="small"
        name={"number" + index}
        variant="outlined"
      />
    </Grid>
  );
};

export const RequestOTP = observer(
  ({
    setPageState,
    pageState: {
      data: { ref_code, username, password, phone_number },
    },
    backState,
    fire_request_otp,
    loading_request_otp,
    fire_verify_otp,
    loading_verify_otp,
    isSuccess,
  }: any) => {
    const [form, setForm] = useState<any>({});
    const { enqueueSnackbar } = useSnackbar();
    const useStyles = makeStyles({
      root: {
        width: "40%",
        backgroundColor: "#279825",
      },
      label: {
        color: "#fff",
      },
    });
    const btnStyles = useStyles();
    return (
      <Grid container direction="column" spacing={3}>
        <Grid item css={{ position: "relative" }}>
          <IconButton
            onClick={() => {
              setPageState({
                name: backState,
                data: {},
              });
            }}
            css={{ position: "absolute", left: 20 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box
            fontSize={14}
            textAlign="center"
            css={{ color: "var(--primary)" }}
          >
            OTP has been sent to {phone_number}
          </Box>
          <Box
            fontWeight="fontWeightBold"
            textAlign="center"
            fontSize="h5.fontSize"
          >
            Please enter 6 digits OTP
          </Box>
        </Grid>
        <Box px={{ md: 8, xs: 0 }} mt={4}>
          <Grid container direction="row" spacing={1}>
            {Array.from(Array(6).keys()).map((_v, index) => (
              <OtpTextField index={index} form={form} setForm={setForm} />
            ))}
          </Grid>
        </Box>
        <Grid item>
          <Box mt={2} textAlign="center">
            <Button
              disabled={
                !_.every(Array.from(Array(6).keys()), (_v, i) => {
                  return form["number" + i] && form["number" + i].length > 0;
                })
              }
              onClick={() => {
                fire_verify_otp(
                  ref_code,
                  _.map(Array.from(Array(6).keys()), (_v, i) => {
                    return form["number" + i];
                  }).join(""),
                  username,
                  password
                )
                  .then(({ data }: { data: any }) => {
                    isSuccess(data);
                  })
                  .catch((ex: any) => {
                    enqueueSnackbar("OTP ผิดพลาด", {
                      key: "loginError",
                      variant: "error",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  });
              }}
              size="large"
              variant="contained"
              classes={{
                root: btnStyles.root,
                label: btnStyles.label,
              }}
            >
              {loading_verify_otp && (
                <CircularProgress size="1rem" color="inherit" />
              )}
              Submit
            </Button>
            <Button
              style={{ marginTop: "0.5rem" }}
              size="small"
              fullWidth
              onClick={() => {
                fire_request_otp(username, password)
                  .then(() => {
                    enqueueSnackbar("ส่ง OTP อีกครั้งไปที่ " + phone_number, {
                      key: "otpAgain",
                      variant: "info",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  })
                  .catch(() => {
                    enqueueSnackbar("ไม่สำเร็จ", {
                      key: "otpAgain",
                      variant: "error",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  });
              }}
              variant="text"
              color="primary"
            >
              {loading_request_otp && (
                <CircularProgress size="1rem" color="inherit" />
              )}
              Resend
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }
);
