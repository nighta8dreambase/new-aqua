import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { VariantType, useSnackbar } from "notistack";
import { useRequestOTP } from "../services/api/auth/useRequestOTP";
import { useVerifyOTP } from "../services/api/auth/useVerifyOTP";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import logo from "../components/assets/logo-PMH.svg";
import { RequestOTP } from "./RequestOTP";

const State_1 = ({ setPageState }: any) => {
  const [form, setForm] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const { fire_request_otp, loading_request_otp } = useRequestOTP();
  let history = useHistory();

  const onChange = (e: any) => {
    if (e.target.name) {
      let newV = { ...form };
      newV[e.target.name] = e.target.value;
      setForm(newV);
    }
  };
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Box
          fontSize="h5.fontSize"
          fontWeight="fontWeightBold"
          textAlign="center"
        >
          Login
        </Box>
      </Grid>
      <Box px={2} py={0.5}>
        <TextField
          required
          onChange={onChange}
          value={form.username || ""}
          className="w-full"
          name="username"
          label="Username"
          variant="outlined"
          margin="dense"
        />
      </Box>
      <Box px={2} py={0.5}>
        <TextField
          required
          onChange={onChange}
          type="password"
          value={form.password || ""}
          className="w-full"
          name="password"
          label="Password"
          variant="outlined"
          margin="dense"
        />
      </Box>
      <Grid item>
        <Box textAlign="center">
          <Button
            disabled={!form.username || !form.password}
            onClick={() => {
              fire_request_otp(form.username, form.password).then(
                ({ data }) => {
                  if (data.data) {
                    enqueueSnackbar(
                      "กรุณากรอก OTP ที่ส่งไปยังเบอร์ " +
                        data.data.phone_number,
                      {
                        key: "otpShow",
                        variant: "info",
                        autoHideDuration: 3000,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                      }
                    );
                    setPageState({
                      name: "OTP",
                      data: {
                        phone_number: data.data.phone_number,
                        ref_code: data.data.ref_code,
                        ...form,
                      },
                    });
                  } else {
                    enqueueSnackbar("Username/Password ผิดพลาด", {
                      key: "loginError",
                      variant: "error",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  }
                }
              );
            }}
            size="large"
            variant="contained"
            color="primary"
            css={{ width: "40%" }}
          >
            {loading_request_otp && (
              <CircularProgress size="1rem" color="inherit" />
            )}
            Submit
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Login = observer(() => {
  const [pageState, setPageState] = useState({ name: "Login" });
  const { fire_request_otp, loading_request_otp } = useRequestOTP();
  const { fire_verify_otp, loading_verify_otp } = useVerifyOTP();
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const isSuccess = ({ data }: { data: any }) => {
    localStorage.setItem("token", data.access_token);
    enqueueSnackbar("เข้าสู่ระบบสำเร็จ", {
      key: "loginSuccess",
      variant: "success",
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });
    setTimeout(() => {
      if (localStorage.getItem("token")) {
        history.push("/");
      }
    }, 300);
  };
  return (
    <Box
      css={{ backgroundColor: "var(--primary-bg)" }}
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <img src={logo} css={{ position: "absolute", top: 20 }} />
      <Container maxWidth="sm">
        <Paper>
          <Box p={4}>
            {pageState.name === "Login" ? (
              <State_1 {...{ setPageState, pageState }} />
            ) : (
              false
            )}
            {pageState.name === "OTP" ? (
              <RequestOTP
                {...{
                  setPageState,
                  pageState,
                  backState: "Login",
                  fire_request_otp,
                  loading_request_otp,
                  fire_verify_otp,
                  loading_verify_otp,
                  isSuccess,
                }}
              />
            ) : (
              false
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
});
