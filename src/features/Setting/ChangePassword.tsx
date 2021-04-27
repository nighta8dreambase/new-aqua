import React, { useEffect, useState } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { Box, Button, Container, TextField } from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import { UserChangePassword } from "../../types/user";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { RequestOTP } from "../RequestOTP";
import { usePasswordRequestOTP } from "../../services/api/setting/usePasswordRequestOTP";
import { usePasswordVerifyOTP } from "../../services/api/setting/usePasswordVerifyOTP";
import { useChangePassword } from "../../services/api/setting/useChangePassword";
import { useHistory } from "react-router-dom";

export const ChangePassword = observer((props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();
  const [pageState, setPageState] = useState<{ name: string; data?: any }>({
    name: "ChangePassword",
  });
  const { fire_request_otp, loading_request_otp } = usePasswordRequestOTP();
  const {
    result_token,
    fire_verify_otp,
    loading_verify_otp,
  } = usePasswordVerifyOTP();
  const {
    result_changepassword,
    result_changepassword_message,
    fire_changepassword,
  } = useChangePassword();
  const [form, setForm] = useState<UserChangePassword>({
    // old_password: "",
    new_password: "",
    new_password_again: "",
  });
  const setVal = (k: any, v: any) => {
    let newV: any = { ...form };
    newV[k] = v;
    setForm(newV);
  };
  const onChange = (e: any) => {
    if (e.target.name) {
      setVal(e.target.name, e.target.value);
    }
  };

  const isSuccess = ({ data }: { data: any }) => {
    fire_changepassword(data.secret_code, form.new_password).then(
      ({ data }: { data: any }) => {
        if (data.code === 1) {
          enqueueSnackbar("Change password success", {
            key: "changePasswordSuccess",
            variant: "success",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          });
          setTimeout(() => {
            history.push("/setting");
          }, 300);
        } else {
          enqueueSnackbar("Can't change password please try again.", {
            key: "changePasswordError",
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          });
          setTimeout(() => {
            history.push("/setting");
          }, 300);
        }
      }
    );
  };

  return (
    <Container maxWidth="sm" className="py-4">
      <Box mb={2}>
        <SubBar title={""} reload={false} back={true} />
      </Box>
      <Box
        css={{
          borderRadius: 5,
          backgroundColor: "#fff",
        }}
        py={3}
        px={5}
      >
        {pageState.name === "ChangePassword" ? (
          <>
            <Box fontWeight={600} fontSize={23} mb={2}>
              Change password
            </Box>
            <Box>
              {[
                // { name: "old_password", label: "Your old password" },
                { name: "new_password", label: "Your new password" },
                { name: "new_password_again", label: "New password again" },
              ].map(({ name, label }) => {
                let f: any = form;
                return (
                  <Box mb={1}>
                    <TextField
                      label={label}
                      name={name}
                      value={f[name]}
                      onChange={onChange}
                      required
                      type="password"
                      placeholder={label}
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                );
              })}
            </Box>
            <Box maxWidth={{ xs: "100%", md: "50%" }} mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={async () => {
                  var valid = _.every(_.keys(form), (v, i) => {
                    const f: any = form;
                    return f[v] !== null && f[v] !== "";
                  });
                  if (valid) {
                    if (form.new_password === form.new_password_again) {
                      fire_request_otp(
                        webStore.profile?.phone_number || ""
                      ).then(({ data }) => {
                        if (data.data) {
                          enqueueSnackbar(
                            `กรุณากรอก OTP ที่ส่งไปยังเบอร์ ${data.data.phone_number}`,
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
                              username: "",
                              password: "",
                            },
                          });
                        } else {
                          enqueueSnackbar("Password ผิดพลาด", {
                            key: "passwordError",
                            variant: "error",
                            autoHideDuration: 3000,
                            anchorOrigin: {
                              vertical: "top",
                              horizontal: "center",
                            },
                          });
                        }
                      });
                    } else {
                      enqueueSnackbar(
                        "Password does not match please try again.",
                        {
                          key: "passwordError",
                          variant: "error",
                          autoHideDuration: 3000,
                          anchorOrigin: {
                            vertical: "top",
                            horizontal: "center",
                          },
                        }
                      );
                    }
                  } else {
                    enqueueSnackbar("Please enter your password.", {
                      key: "passwordNull",
                      variant: "error",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </>
        ) : (
          false
        )}
        {pageState.name === "OTP" ? (
          <RequestOTP
            {...{
              setPageState,
              pageState,
              backState: "ChangePassword",
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
    </Container>
  );
});
