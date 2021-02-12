import { css, jsx } from "@emotion/react";
import React, { Fragment, useEffect, useState } from "react";
import _ from "lodash";
import {
  Box,
  Container,
  Grid,
  FormControl,
  Button,
  CircularProgress,
  Paper,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  MuiThemeProvider,
  createMuiTheme,
  Avatar,
  LinearProgress,
  Badge,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import { useHistory, useParams } from "react-router-dom";
import { useReadUser } from "../../services/api/user/useReadUser";
import LuxonUtils from "@date-io/luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { UserInfoCard } from "./UserInfoCard";
import { DeviceHistoryDatagrid } from "./DeviceHistoryDatagrid";
import { DateFilter } from "../../components/DateFilter";

import { BodyTempGraph } from "./BodyTempGraph";
import { HeartRateGraph } from "./HeartRateGraph";
import { BloodPressureGraph } from "./BloodPressureGrph";
import { UserCreateInput } from "../../types/user";
import { useCreateUser } from "../../services/api/user/useCreateUser";
import { useSnackbar } from "notistack";
import { useListHospital } from "../../services/api/user/useListHospital";
import { useListAgencies } from "../../services/api/user/useListAgencies";
import { useListBranches } from "../../services/api/user/useListBranches";
import { ToolbarComponentProps } from "@material-ui/pickers/Picker/Picker";
import { useUploadImage } from "../../services/api/user/useUploadImage";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { arrayIncludes } from "@material-ui/pickers/_helpers/utils";

export const NON_REQUIRE_USER_FIELD = [
  "agency_contracted_id",
  "avatar",
  "avatar_url",
  "department_port",
  "destination_port",
  // "device_id_1",
  "device_id_2",
  "device_provider_id",
  "hospital_contracted_id",
  "title_name_id",
];

const LabelForm = (props: any) => {
  return (
    <Box fontSize={13} css={{ color: "rgba(75, 76, 86, 0.4)" }} mt={4} mb={1}>
      {props.children}
    </Box>
  );
};

const InputText = ({ input, form, onChange, ...rest }: any) => {
  return (
    <TextField
      label={input.label}
      value={form[input.name]}
      onChange={onChange}
      name={input.name}
      placeholder={"Please enter " + input.label}
      // helperText={`Please enter ${input.label}`}
      fullWidth
      margin="dense"
      // InputLabelProps={{
      //   shrink: true,
      // }}
      variant="outlined"
      size="small"
      {...rest}
    />
  );
};

const InputDropdown = observer(
  ({
    option,
    input,
    value,
    onChange,
    error,
  }: {
    option: any;
    input: any;
    value: any;
    onChange: any;
    error: boolean;
  }) => {
    return (
      <FormControl
        variant="outlined"
        style={{ width: "100%" }}
        disabled={(option || []).length === 0}
        required={NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0}
        size="small"
        margin="dense"
      >
        <InputLabel id="demo-simple-select-outlined-label">
          {input.label}
        </InputLabel>
        <Select
          disabled={(option || []).length === 0}
          labelId="demo-simple-select-outlined-label"
          name={input.name}
          label={input.label}
          value={value}
          onChange={onChange}
          fullWidth
          required={NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0}
          error={error}
        >
          {option?.map((v: any) => {
            return <MenuItem value={v.value}>{v.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
    );
  }
);

export const InputDate = observer(
  ({
    input,
    form,
    onChange,
    error,
    value,
  }: {
    input: any;
    form?: any;
    onChange: any;
    error: boolean;
    value?: any;
  }) => {
    const f: any = form;
    const v: any = form ? f[input.name] : value;
    return (
      <FormControl
        required={NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0}
        style={{ width: "100%" }}
        size="small"
        margin="dense"
      >
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <KeyboardDatePicker
            required={NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0}
            style={{ margin: 0, width: "100%" }}
            autoOk
            format="dd/MM/yyyy"
            margin="normal"
            id="from"
            size="small"
            ToolbarComponent={(props: ToolbarComponentProps) => {
              return (
                <div
                  style={{
                    background: "#494592",
                  }}
                >
                  <Box p={2}>
                    <Button
                      size="small"
                      css={css`
                        font-size: 0.8rem;
                        color: white;
                        line-height: 1rem;
                        font-weight: bold;
                        text-transform: none;
                      `}
                      onClick={() => {
                        props.setOpenView("date");
                      }}
                    >
                      {props.date?.weekdayLong + " " + props.date?.day}
                    </Button>
                    <Grid>
                      <Button
                        size="small"
                        css={css`
                          font-size: 1.5rem;
                          line-height: 1.65rem;
                          font-weight: bold;
                          color: white;
                          text-transform: none;
                        `}
                        onClick={() => {
                          props.setOpenView("month");
                        }}
                      >
                        {props.date?.monthLong}
                      </Button>
                      <Button
                        size="small"
                        css={css`
                          font-size: 1.5rem;
                          line-height: 1.5rem;
                          font-weight: bold;
                          color: white;
                          text-transform: none;
                        `}
                        onClick={() => {
                          props.setOpenView("year");
                        }}
                      >
                        {props.date?.year}
                      </Button>
                    </Grid>
                  </Box>
                </div>
              );
            }}
            inputVariant="outlined"
            label={input.label}
            value={v}
            onChange={onChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            error={error}
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    );
  }
);

//
export const UserCreate = observer(() => {
  const [form, setForm] = useState<UserCreateInput>({
    avatar: null,
    avatar_url: null,
    title_name_id: null,
    name: "",
    surname: "",
    gender: "",
    date_of_birth: null,
    nationality: "",
    card_number: "",
    branch_id: "",
    place_of_use: "",
    device_id_1: null,
    device_id_2: null,
    device_provider_id: "",
    start_date: null,
    end_date: null,
    department_port: "",
    destination_port: "",
    agency_contracted_id: "",
    hospital_contracted_id: "",
  }); //

  const [ERROR_REQUIRE, setErrorRequired] = useState(Array());
  const { enqueueSnackbar } = useSnackbar();
  const { fire_user_create, loading_user_create } = useCreateUser();
  const { fire_upload_image, loading_upload_image } = useUploadImage();
  const { result_hospital, loading_hospital, error_hospital } = useListHospital(
    form.branch_id || ""
  );
  const { result_agencies, loading_agencies, error_agencies } = useListAgencies(
    form.branch_id || ""
  );
  const {
    result_branches,
    loading_branches,
    error_branches,
  } = useListBranches();

  const history = useHistory();
  const setVal = (k: any, v: any) => {
    let newV: any = { ...form };
    newV[k] = v;
    setForm(newV);
  };
  const onChange = (e: any) => {
    if (e.target.name) {
      setVal(e.target.name, e.target.value);
    }
    if (e.target.value !== null || e.target.value !== "") {
      setErrorRequired(ERROR_REQUIRE.filter((x) => x != e.target.name));
    }
  };

  let option: any = [];
  option["gender"] = [
    { value: "m", name: "Male" },
    { value: "f", name: "Female" },
  ];

  option["hospital_contracted_id"] = loading_agencies
    ? []
    : result_hospital.map((h: any) => {
        return { value: h.id, name: h.name_th };
      });
  option["agency_contracted_id"] = loading_agencies
    ? []
    : result_agencies.map((h: any) => {
        return { value: h.id, name: h.name_th };
      });
  option["branch_id"] = loading_branches
    ? []
    : result_branches.map((h: any) => {
        return { value: h.id, name: h.name_th };
      });
  useEffect(() => {
    setVal("agency_contracted_id", null);
    setVal("hospital_contracted_id", null);
  }, [form && form.branch_id]);

  return (
    <>
      <Container maxWidth="md" className="py-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SubBar
              reload={false}
              back={true}
              title={"Create User"}
              importExcel={"import"}
            />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="md" className="py-2">
        <Paper variant="outlined" css={{ borderWidth: 0 }}>
          <Box py={4} px={{ xs: 2, md: 6 }}>
            <Box fontSize="h5.fontSize" fontWeight={600} mb={1}>
              User information
            </Box>
            <Grid item container>
              <Box order={{ xs: 2, md: 0 }} width={{ xs: "100%", md: "80%" }}>
                <Grid item container>
                  <Grid item xs={12}>
                    <LabelForm>Information</LabelForm>
                  </Grid>
                  <Grid item container spacing={1}>
                    {[
                      { name: "name", label: "Name", width: 6 },
                      { name: "surname", label: "Surname", width: 6 },
                    ].map((input) => {
                      return (
                        <Grid item md={(input.width as 6 | 2 | 5) || 6} xs={12}>
                          <InputText
                            {...{
                              onChange,
                              form,
                              input,
                              required:
                                NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0,
                              error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                            }}
                          />
                        </Grid>
                      );
                    })}
                    <Grid item md={2} xs={12}>
                      <InputDropdown
                        option={option["gender"]}
                        input={{ name: "gender", label: "Gender" }}
                        value={form["gender"]}
                        onChange={onChange}
                        error={ERROR_REQUIRE.indexOf("gender") >= 0}
                      />
                    </Grid>
                    {[{ name: "nationality", label: "Nationality" }].map(
                      (input) => {
                        return (
                          <Grid item md={5} xs={12}>
                            <InputText
                              {...{
                                onChange,
                                form,
                                input,
                                required:
                                  NON_REQUIRE_USER_FIELD.indexOf(input.name) <
                                  0,
                                error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                              }}
                            />
                          </Grid>
                        );
                      }
                    )}
                    <Grid item md={5} xs={12}>
                      <InputDate
                        form={form}
                        input={{
                          name: "date_of_birth",
                          label: "Date of Birth",
                        }}
                        onChange={(date: MaterialUiPickersDate) => {
                          setVal(
                            "date_of_birth",
                            date ? new Date(date.toString()) : null
                          );
                          if (date) {
                            setErrorRequired(
                              ERROR_REQUIRE.filter((x) => x != "date_of_birth")
                            );
                          }
                        }}
                        error={ERROR_REQUIRE.indexOf("date_of_birth") >= 0}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <LabelForm>Passport</LabelForm>
                  </Grid>
                  {[{ name: "card_number", label: "Card Number" }].map(
                    (input) => {
                      return (
                        <Grid item xs={12}>
                          <InputText
                            {...{
                              onChange,
                              form,
                              input,
                              required:
                                NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0,
                              error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                            }}
                          />
                        </Grid>
                      );
                    }
                  )}
                  <Grid item xs={12}>
                    <LabelForm>Yatch</LabelForm>
                  </Grid>
                  {[{ name: "place_of_use", label: "Yatch Name" }].map(
                    (input) => {
                      return (
                        <Grid item xs={12}>
                          <InputText
                            {...{
                              onChange,
                              form,
                              input,
                              required:
                                NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0,
                              error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                            }}
                          />
                        </Grid>
                      );
                    }
                  )}
                  <Box mb={3} width="100%">
                    &nbsp;
                  </Box>
                  <Grid item xs={12}>
                    <LabelForm>Wristband</LabelForm>
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
                    {[
                      { name: "device_id_1", label: "IMEI 01" },
                      { name: "device_id_2", label: "IMEI 02" },
                    ].map((input) => {
                      return (
                        <Grid item md={6} xs={12}>
                          <InputText
                            {...{
                              onChange,
                              form,
                              input,
                              required:
                                NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0,
                              error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid item xs={12}>
                    <LabelForm>Quarantine</LabelForm>
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
                    {[
                      { name: "start_date", label: "Start quarantine" },
                      { name: "end_date", label: "End quarantine" },
                    ].map((input) => {
                      return (
                        <Grid item md={6} xs={12}>
                          <InputDate
                            form={form}
                            input={input}
                            onChange={(date: MaterialUiPickersDate) => {
                              setVal(
                                input.name,
                                date ? new Date(date.toString()) : null
                              );
                              if (date) {
                                setErrorRequired(
                                  ERROR_REQUIRE.filter((x) => x != input.name)
                                );
                              }
                            }}
                            error={ERROR_REQUIRE.indexOf(input.name) >= 0}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box mb={3} width="100%">
                    &nbsp;
                  </Box>
                  <Grid item xs={12}>
                    <LabelForm>Branch</LabelForm>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <InputDropdown
                      option={option["branch_id"]}
                      input={{ name: "branch_id", label: "Branch" }}
                      value={form["branch_id"]}
                      onChange={onChange}
                      error={ERROR_REQUIRE.indexOf("branch_id") >= 0}
                    />
                  </Grid>
                  {(form.branch_id || loading_hospital || loading_agencies) && (
                    <>
                      <Grid item xs={12}>
                        <LabelForm>Contract</LabelForm>
                      </Grid>
                      <Grid item xs={12} container spacing={1}>
                        {(form.branch_id || loading_hospital) && (
                          <Grid item md={6} xs={12}>
                            <InputDropdown
                              option={option["hospital_contracted_id"]}
                              input={{
                                name: "hospital_contracted_id",
                                label: "Hospital",
                              }}
                              value={form["hospital_contracted_id"]}
                              onChange={onChange}
                              error={
                                ERROR_REQUIRE.indexOf(
                                  "hospital_contracted_id"
                                ) >= 0
                              }
                            />
                          </Grid>
                        )}
                        {(form.branch_id || loading_agencies) && (
                          <Grid item md={6} xs={12}>
                            <InputDropdown
                              option={option["agency_contracted_id"]}
                              input={{
                                name: "agency_contracted_id",
                                label: "Agencies",
                              }}
                              value={form["agency_contracted_id"]}
                              onChange={onChange}
                              error={
                                ERROR_REQUIRE.indexOf("agency_contracted_id") >=
                                0
                              }
                            />
                          </Grid>
                        )}
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <LabelForm>Departure/Destination</LabelForm>
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
                    {[
                      { name: "department_port", label: "Departure Port" },
                      { name: "destination_port", label: "Destination Port" },
                    ].map((input) => {
                      return (
                        <Grid item md={6} xs={12}>
                          <InputText
                            {...{
                              onChange,
                              form,
                              input,
                              required:
                                NON_REQUIRE_USER_FIELD.indexOf(input.name) < 0,
                              error: ERROR_REQUIRE.indexOf(input.name) >= 0,
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
                    <Grid item md={6} xs={12}>
                      <Box mt={6}>
                        <Button
                          fullWidth
                          css={{ backgroundColor: "#279825", color: "#fff" }}
                          onClick={async () => {
                            setErrorRequired(Array());
                            var valid = _.every(_.keys(form), (v, i) => {
                              if (NON_REQUIRE_USER_FIELD.indexOf(v) >= 0) {
                                return true;
                              }
                              const f: any = form;
                              return f[v] !== null && f[v] !== "";
                            });

                            if (valid) {
                              try {
                                fire_user_create(form)
                                  .then(() => {
                                    history.goBack();
                                    enqueueSnackbar("สมัครสมาชิกสำเร็จ", {
                                      variant: "success",
                                      autoHideDuration: 3000,
                                      anchorOrigin: {
                                        vertical: "top",
                                        horizontal: "center",
                                      },
                                    });
                                  })
                                  .catch((ex) => {
                                    enqueueSnackbar(
                                      "สมัครสมาชิกไม่สำเร็จ" +
                                        (ex ? " : " + ex.toString() : ""),
                                      {
                                        variant: "error",
                                        autoHideDuration: 3000,
                                        anchorOrigin: {
                                          vertical: "top",
                                          horizontal: "center",
                                        },
                                      }
                                    );
                                  });
                              } catch (ex) {}
                            } else {
                              setErrorRequired(() => {
                                return _.keys(form).map((v) => {
                                  const f: any = form;
                                  if (
                                    NON_REQUIRE_USER_FIELD.indexOf(v) < 0 &&
                                    (f[v] == null || f[v] == "")
                                  ) {
                                    return v;
                                  }
                                });
                              });
                            }
                          }}
                          size="large"
                          variant="contained"
                          // color="primary"
                        >
                          {loading_user_create && (
                            <CircularProgress size="1rem" color="inherit" />
                          )}
                          Submit
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box
                order={{ xs: 0, md: 2 }}
                width={{ xs: "100%", md: "20%" }}
                textAlign="center"
              >
                <LabelForm>Profile Avatar</LabelForm>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar_url"
                  type="file"
                  onChange={({ target }) => {
                    console.log("set");

                    if (target && target?.files?.[0]) {
                      const formData = new FormData();
                      formData.append("image", target?.files?.[0]);
                      console.log("fire");
                      fire_upload_image(formData)
                        .then(({ data }) => {
                          if (data.data) {
                            setVal("avatar_url", data.data?.image_url);
                            let newV: any = { ...form };
                            newV["avatar_url"] = data.data?.image_url;
                            newV["avatar"] = data.data?.id;
                            setForm(newV);
                            enqueueSnackbar("Upload สำเร็จ", {
                              variant: "success",
                              autoHideDuration: 3000,
                              anchorOrigin: {
                                vertical: "top",
                                horizontal: "center",
                              },
                            });
                          } else {
                            enqueueSnackbar("Upload ไม่สำเร็จ", {
                              variant: "error",
                              autoHideDuration: 3000,
                              anchorOrigin: {
                                vertical: "top",
                                horizontal: "center",
                              },
                            });
                          }
                        })
                        .catch(() => {
                          enqueueSnackbar("Upload ไม่สำเร็จ", {
                            variant: "error",
                            autoHideDuration: 3000,
                            anchorOrigin: {
                              vertical: "top",
                              horizontal: "center",
                            },
                          });
                        });
                    }
                  }}
                />
                <label htmlFor="avatar_url">
                  <Button
                    component="span"
                    disabled={loading_upload_image}
                    variant="text"
                    color="inherit"
                    css={{ position: "relative" }}
                  >
                    <Badge
                      overlap="circle"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      badgeContent={
                        <Box
                          p={1}
                          css={{
                            backgroundColor: "#4650AC",
                            borderRadius: "50%",
                          }}
                        >
                          <BorderColorIcon
                            style={{ color: "white", fontSize: 15 }}
                          />
                        </Box>
                      }
                    >
                      <Avatar
                        css={{
                          width: "80px",
                          height: "80px",
                        }}
                        alt={"avatar"}
                        src={form["avatar_url"] || ""}
                      />
                    </Badge>

                    {loading_upload_image && (
                      <LinearProgress
                        css={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                        }}
                      />
                    )}
                  </Button>
                </label>
              </Box>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
});
export const UserCreateMobile = UserCreate;
