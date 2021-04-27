import { Theme } from "@emotion/react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  createStyles,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useHistory } from "react-router-dom";
import xlsx from "xlsx";
import fa_cloud_upload from "../../components/assets/fa-cloud-upload.svg";
import fa_upload_white from "../../components/assets/fa-upload-white.svg";
import fa_upload from "../../components/assets/fa-upload.svg";
import { useImportUser } from "../../services/api/user/useImportUser";
import { useListBranches } from "../../services/api/user/useListBranches";
import { SubBar } from "../Dashboard/Dashboard";
import { NON_REQUIRE_USER_FIELD } from "./UserCreate";

//
type ImportRow = {
  name: string;
  surname: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  card_number: string;
  quarantine_start: string;
  quarantine_end: string;
  place: string;
  contract_hospital: string;
  contract_agency: string;
  phone_number: string;
  email: string;

  departure_port: string;
  destination_port: string;
  imei_1: string;
  imei_2: string;
};
export const UserImport = observer(() => {
  const [dragOverState, setDragOverState] = useState(false);
  const [fails, setFails] = useState<any[]>([]);
  const [branchId, setBranchId] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const history = useHistory();
  const [uploadState, setUploadState] = useState(false);
  const [file, setFile] = useState<any>();
  const [failed, setFailed] = useState(false);
  const [informationIsValid, set_informationIsValid] = useState(false);
  const { loading_user_import, fire_user_import } = useImportUser();
  const [progress, setProgress] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const {
    result_branches,
    loading_branches,
    error_branches,
  } = useListBranches();

  console.log("result_branches", result_branches);

  const handleDragOver = (e: any) => {
    setDragOverState(true);
  };

  const handleDragLeave = (e: any) => {
    setDragOverState(false);
  };

  const handleDrop = (e: any) => {
    setDragOverState(false);
  };

  const handleDropZone = (acceptedFiles: any) => {
    if (acceptedFiles.length > 1) {
      alert("Please select only one file");
    } else if (
      acceptedFiles[0].type != "text/csv" &&
      acceptedFiles[0].type != "application/vnd.ms-excel" &&
      acceptedFiles[0].type !=
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please select .csv / .xls / .xlsx file type only");
    } else {
      //file is okay
      setUploadState(true);
      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress + 1 >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return oldProgress + 1;
        });
      }, 30);
      const onError = (msgs: any[]) => {
        setFails(msgs);
        setFailed(true);
        setProgress(100);
      };
      try {
        const f = acceptedFiles[0];
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt: any) => {
          try {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            var workbook = xlsx.read(bstr, {
              type: "binary",
            });
            let json_object: ImportRow[] = [];
            workbook.SheetNames.forEach(function (sheetName, i) {
              if (i !== 0) {
                return;
              }
              // Here is your object//
              var XL_row_object = xlsx.utils.sheet_to_json(
                workbook.Sheets[sheetName]
              );
              json_object = XL_row_object as any[];
            });
            const errors = [];

            for (const r of json_object) {
              const prefix = "ROW " + (json_object.indexOf(r) + 1) + " : ";
              /*  VALIDATE MISSING FIELD */
              _.each(r, (k) => {
                const s: any = (r as any)[k];
                if (!s && NON_REQUIRE_USER_FIELD.indexOf(k) < 0)
                  errors.push(`${prefix}Missing ${k}`);
              });
              /*  VALIDATE ENUM */
              if (["m", "f"].indexOf(r.gender) < 0) {
                errors.push(`${prefix}Gender need to be "m" or "f"`);
              }
              /* VALIDATE IMEI */
              _.each(["imei_1", "imei_2"], (k) => {
                const s: any = (r as any)[k];
                if (s && s.length !== 12) {
                  errors.push(`${prefix} ${k} - Must be 12 digits`);
                }
              });
            }
            if (errors.length > 0) {
              onError(errors);
            } else {
              setFails([]);
              setFailed(false);
              setRows(json_object);
              setProgress(100);
              set_informationIsValid(false);
              setFile(bstr);
            }
            console.log("json_object", json_object);
          } catch (ex: any) {
            onError([ex.toString()]);
          }
        };
        reader.readAsBinaryString(f);
      } catch (ex: any) {
        onError([ex.toString()]);
      }
    }
  };

  const handleSubmit = () => {
    if (!informationIsValid) {
      alert(`Please review data and click 'All of information is correct'`);
    } else {
      fire_user_import({
        branch_id: branchId,
        file: file,
      })
        .then(() => {
          enqueueSnackbar(
            "Users in the excel file have been created successfully!",
            { variant: "success" }
          );
          history.push("/user/list");
        })
        .catch((ex) => {
          enqueueSnackbar("Upload Fail!:" + (ex ? " : " + ex.toString() : ""), {
            variant: "error",
          });
        });
    }
  };

  const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor: "#FFF",
      },
      bar: {
        borderRadius: 5,
        backgroundColor: "var(--primary)",
      },
    })
  )(LinearProgress);

  const uploadNewExcel = () => {
    setUploadState(false);
    set_informationIsValid(false);
    setFails([]);
    setRows([]);
    setProgress(0);
  };

  function createData(
    name: string,
    gender: string,
    age: number,
    nationality: string,
    IMEI: string,
    branch: string,
    avatar: string,
    yatch: string,
    departure: string
  ) {
    return {
      name,
      gender,
      age,
      nationality,
      IMEI,
      branch,
      avatar,
      yatch,
      departure,
    };
  }

  return (
    <>
      <Container maxWidth="lg" className="py-4">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SubBar reload={false} back={true} title={"Import many users"} />
            <Paper className="mt-4">
              <Container className="py-12">
                <Grid className="mx-6 relative">
                  <Box className="text-xl" fontWeight={600}>
                    Create many user from excels
                  </Box>
                  <Box className="text-xs mt-2 mb-8">
                    Please use templates example from this{" "}
                    <a
                      href="#"
                      className="font-bold cursor-pointer"
                      style={{ color: "var(--primary)" }}
                    >
                      link
                    </a>
                  </Box>
                  {progress === 100 ? (
                    <Box mb={2}>
                      <Grid container justify="space-between">
                        {failed ? (
                          <Box
                            className="text-xs"
                            css={{ color: "var(--fresh-error)" }}
                            fontWeight={600}
                          >
                            Validation fail
                          </Box>
                        ) : (
                          <Box
                            className="text-base"
                            css={{ color: "var(--primary)" }}
                            fontWeight={700}
                          >
                            Review &amp; Submit ( {rows.length} Records )
                          </Box>
                        )}
                        <Box
                          className="cursor-pointer text-xs"
                          display="flex"
                          alignItems="center"
                          fontWeight={600}
                          onClick={uploadNewExcel}
                        >
                          <Box mr={1}>Upload new excel</Box>{" "}
                          <img
                            src={fa_cloud_upload}
                            alt="cloud-upload"
                            width={15}
                          />{" "}
                        </Box>
                      </Grid>
                    </Box>
                  ) : (
                    ""
                  )}
                  {progress === 100 && !failed ? (
                    <>
                      <Box mb={5}>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table" size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"name"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"surname"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"date_of_birth"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"gender"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"nationality"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"card_number"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"quarantine_start"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"quarantine_end"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"place"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"contract_hospital"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"contract_agency"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"phone_number"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"email"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"departure_port"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"destination_port"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"imei_1"}
                                </TableCell>
                                <TableCell css={{ color: "var(--hard-gray)" }}>
                                  {"imei_2"}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell>{row.name}</TableCell>
                                  <TableCell>{row.surname}</TableCell>
                                  <TableCell>{row.date_of_birth}</TableCell>
                                  <TableCell>{row.gender}</TableCell>
                                  <TableCell>{row.nationality}</TableCell>
                                  <TableCell>{row.card_number}</TableCell>
                                  <TableCell>{row.quarantine_start}</TableCell>
                                  <TableCell>{row.quarantine_end}</TableCell>
                                  <TableCell>{row.place}</TableCell>
                                  <TableCell>{row.contract_hospital}</TableCell>
                                  <TableCell>{row.contract_agency}</TableCell>
                                  <TableCell>{row.phone_number}</TableCell>
                                  <TableCell>{row.email}</TableCell>
                                  <TableCell>{row.departure_port}</TableCell>
                                  <TableCell>{row.destination_port}</TableCell>
                                  <TableCell>{row.imei_1}</TableCell>
                                  <TableCell>{row.imei_2}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                      <Box>
                        <Divider />
                        <Box mt={4}>
                          <Grid container alignItems="center" justify="center">
                            <Grid item xs={2} css={{ color: "#919299" }}>
                              Import to branch
                            </Grid>
                            <Grid item xs={2}>
                              <FormControl
                                variant="outlined"
                                style={{ width: "100%" }}
                                disabled={(result_branches || []).length === 0}
                                required={true}
                                size="small"
                                margin="dense"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Select branch
                                </InputLabel>
                                <Select
                                  disabled={
                                    (result_branches || []).length === 0
                                  }
                                  labelId="demo-simple-select-outlined-label"
                                  label="Select branch"
                                  name="branch"
                                  value={branchId}
                                  onChange={(e: any) => {
                                    setBranchId(e.target.value);
                                  }}
                                  fullWidth
                                  required={true}
                                >
                                  {result_branches?.map((v: any) => {
                                    return (
                                      <MenuItem value={v.id}>
                                        {v.name_en}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box mt={4}>
                          <Grid container alignItems="center" justify="center">
                            <Box
                              className="text-sm cursor-pointer select-none"
                              fontWeight={600}
                              mr={3}
                              display="flex"
                              alignItems="center"
                              onClick={() => {
                                set_informationIsValid(!informationIsValid);
                              }}
                            >
                              <Checkbox checked={informationIsValid} />
                              <Box ml={1}>All of information is correct</Box>
                            </Box>
                            <Button
                              css={{
                                backgroundColor: "#279825",
                                color: "#fff",
                                textTransform: "none",
                              }}
                              disabled={
                                !informationIsValid || loading_user_import
                              }
                              size="large"
                              variant="contained"
                              onClick={handleSubmit}
                            >
                              <Box
                                className="w-56"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {loading_user_import && (
                                  <Box mr={2}>
                                    <CircularProgress
                                      size="1rem"
                                      color="inherit"
                                    />
                                  </Box>
                                )}{" "}
                                Create {rows.length} Users
                              </Box>
                            </Button>
                          </Grid>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Dropzone disabled={uploadState} onDrop={handleDropZone}>
                      {({ getRootProps, getInputProps }) => {
                        return (
                          <section>
                            <div {...getRootProps()}>
                              <input
                                {...getInputProps()}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                multiple={false}
                              />
                              <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className="select-none cursor-pointer"
                              >
                                <Grid
                                  container
                                  direction="column"
                                  className={`${
                                    progress === 100 && failed
                                      ? "px-8 py-6"
                                      : "h-56"
                                  } rounded-md`}
                                  justify={
                                    progress === 100 && failed
                                      ? "flex-start"
                                      : "center"
                                  }
                                  alignItems={
                                    progress === 100 && failed
                                      ? "flex-start"
                                      : "center"
                                  }
                                  style={{
                                    color: `${
                                      progress === 100 && failed
                                        ? "black"
                                        : dragOverState
                                        ? "var(--sub-primary)"
                                        : "var(--primary)"
                                    }`,
                                    backgroundColor: `${
                                      progress === 100 && failed
                                        ? "#FAEEED"
                                        : dragOverState
                                        ? "var(--primary)"
                                        : "var(--sub-primary)"
                                    }`,
                                  }}
                                >
                                  {uploadState ? (
                                    failed ? (
                                      <Box className="text-xs">
                                        {fails.map((ex) => {
                                          return <Box mb={1}>{ex}</Box>;
                                        })}
                                      </Box>
                                    ) : (
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        className="w-full"
                                        px={20}
                                      >
                                        <Box
                                          className="text-xs font-bold"
                                          mb={2}
                                        >
                                          {progress >= 75
                                            ? "Validating"
                                            : `Uploading ${progress}%`}
                                        </Box>
                                        <BorderLinearProgress
                                          variant="determinate"
                                          value={progress}
                                          className="w-full"
                                        />
                                      </Box>
                                    )
                                  ) : (
                                    <>
                                      <Box mb={2}>
                                        <img
                                          draggable={false}
                                          src={
                                            dragOverState
                                              ? fa_upload_white
                                              : fa_upload
                                          }
                                          alt="upload"
                                        />
                                      </Box>
                                      <Box className="text-xs font-bold">
                                        {dragOverState
                                          ? "Release to upload"
                                          : "Upload your excel"}
                                      </Box>
                                    </>
                                  )}
                                </Grid>
                              </div>
                            </div>
                          </section>
                        );
                      }}
                    </Dropzone>
                  )}
                </Grid>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});
export const UserImportMobile = UserImport;
