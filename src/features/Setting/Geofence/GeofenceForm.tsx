import { Global, css } from "@emotion/react";

import {
  Paper,
  Box,
  TextField,
  FormControl,
  Select,
  Checkbox,
  InputLabel,
  MenuItem,
  Button,
  CircularProgress,
  Backdrop,
  Container,
  DialogActions,
  DialogContentText,
  Fade,
  Modal,
  Dialog,
  Avatar,
} from "@material-ui/core";
import {
  CellParams,
  ColDef,
  DataGrid,
  GridApi,
  LinkOperator,
  ValueGetterParams,
} from "@material-ui/data-grid";
import { Autocomplete } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useGeofenceContext } from "./GeofenceFormWrapper";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { useReadPlace } from "../../../services/api/geofence/useReadPlace";
import _ from "lodash";
import { User } from "../../../types/user";
export const GeofenceForm = observer(
  (p: {
    handleSave: (
      f: ReturnType<typeof useGeofenceContext>["geofenceForm"],
      d: {
        restrict: "byUser" | "no";
        placeIds: string[];
        userIds: string[];
      }
    ) => void;
    saving: boolean;
  }) => {
    const [openPlaceModal, set_openPlaceModal] = useState<boolean>(false);
    const [openUserModal, set_openUserModal] = useState<boolean>(false);
    const [restrict, setRestrict] = useState<"byUser" | "no">("no");
    const [placeslist, setPlaceslist] = useState([
      { name_en: "", id: "", name_th: "", created_at: "" },
    ]); //ข้อมูลที่อยู่เมื่อเลือก branch
    const [alluserinplace, setAlluserinplace] = useState<Partial<User>[]>([
      { id: "", name: "", surname: "" },
    ]); //ข้อมูล places ที่เลือก
    const { fire_placesRead, fire_alluserPlacesRead } = useReadPlace("");

    const g = useGeofenceContext();

    const onSelectBranch = async () => {
      if (!g.branchId) {
        return;
      }
      const param = g.branchId;
      let placesData: any;
      let getPlace: any;
      getPlace = fire_placesRead(param);
      placesData = await getPlace.then(({ data }: any) => {
        return data.data;
      });
      setPlaceslist(placesData);
    };
    useEffect(() => {
      onSelectBranch();
    }, [g.branchId]);
    ///
    const afterSelectPlaces = async () => {
      const param = g.geofenceForm?.places || [];
      let getUserInPlace: any;
      let Data: any;

      Data = [];
      for (let index = 0; index < param.length; index++) {
        let Dataloop: any;
        const element = param[index];
        getUserInPlace = fire_alluserPlacesRead(element.id);
        Dataloop = await getUserInPlace.then(({ data }: any) => {
          // console.log(data.data)
          if (data.data.length === 0) {
            return [];
          } else {
            return data.data;
          }
        });
        Data = Data.concat(Dataloop);
      }
      // console.log("==============================================================")
      // console.log(Data)
      // console.log("==============================================================")

      if (Data.length === 0) {
        setAlluserinplace([]);
      } else {
        setAlluserinplace(Data);
      }
    };
    useEffect(() => {
      afterSelectPlaces();
    }, [(g?.geofenceForm?.places || []).map((p) => p.id).join(",")]);
    ///

    const formData = g.geofenceForm;
    const disabled = !formData?.geofence.name;
    console.log(formData);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    if (!g.geofenceForm || !formData) {
      return <></>;
    }
    console.log("formData.places", formData.places);
    return (
      <Paper className="lg:w-4/12 w-full lg:max-h-0">
        <div className="bg-white rounded-lg">
          <Box className="text-base" css={{ color: "#4B4C56" }} p={2}>
            <Box>Geofencer Information</Box>
            <Box mt={3}>
              <TextField
                value={formData.geofence.name}
                onChange={(e) => {
                  formData.geofence.name = e.target.value;
                  g.refreshForm();
                }}
                InputProps={{ classes: { input: g.classes.textfield } }}
                id="name"
                placeholder="Name *"
                variant="outlined"
                css={{ width: "100%" }}
              />
            </Box>

            <Box mt={2}>
              <TextField
                value={formData.geofence.max_distance}
                onChange={(e) => {
                  formData.geofence.max_distance = parseFloat(e.target.value);
                  g.refreshForm();
                }}
                type="number"
                id="MaximumDistance"
                placeholder="Maximum distance"
                variant="outlined"
                css={{ width: "70%" }}
                style={{ marginRight: "3%" }}
              />
              <FormControl
                variant="outlined"
                className={g.uiStyle.formControl}
                css={{ width: "27%" }}
              >
                <Select
                  native
                  value={formData.distype}
                  onChange={(e: any) => {
                    formData.distype = e.target.value;
                  }}
                >
                  <option value={"m"}>m</option>
                  <option value={"km"}>km</option>
                </Select>
              </FormControl>
            </Box>
            <Box mt={3}>Geofence restriction</Box>
            <Box mt={1}>
              <Autocomplete
                multiple
                className="w-full"
                options={placeslist}
                value={formData.places}
                open={false}
                onOpen={() => set_openPlaceModal(true)}
                onChange={(event, value) => {
                  formData.places = value;
                  g.refreshForm();
                }}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name_en}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name_en}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={
                      placeslist.length === 0
                        ? "Don't have any place"
                        : "Select place"
                    }
                    placeholder=""
                  />
                )}
              />
            </Box>

            {formData.places.length > 0 && (
              <>
                <Box mt={1}>Target specific user</Box>
                <Box mt={1}>
                  <FormControl
                    variant="outlined"
                    required={true}
                    margin="dense"
                    className="w-full"
                  >
                    <InputLabel id="select-label-strict">
                      Restrict user groups
                    </InputLabel>
                    <Select
                      labelId="select-label-strict"
                      label="Restrict user groups"
                      name="strict"
                      value={restrict}
                      onChange={(e: any) => {
                        setRestrict(e.target.value);
                      }}
                      fullWidth
                      required={true}
                    >
                      <MenuItem value="no">All User</MenuItem>
                      <MenuItem value="byUser">Restrict by user</MenuItem>
                      {/* <MenuItem value="byPlace">Restrict by place</MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}

            {restrict === "byUser" && (
              <Box mt={1}>
                <Autocomplete
                  multiple
                  className="w-full"
                  disabled={(alluserinplace || []).length === 0}
                  options={alluserinplace}
                  value={formData.users}
                  open={false}
                  onOpen={() => set_openUserModal(true)}
                  onChange={(event, value) => {
                    formData.users = value;
                    g.refreshForm();
                  }}
                  disableCloseOnSelect
                  getOptionLabel={(option) =>
                    `${option.name} ${option.surname}`
                  }
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.name} ${option.surname}`}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={
                        alluserinplace.length === 0
                          ? formData.places.length === 0
                            ? "Please select place first"
                            : "Don't have any user in selected places"
                          : "Select user"
                      }
                      placeholder=""
                    />
                  )}
                />
              </Box>
            )}
            <Box mt={4}>
              <Button
                disabled={disabled}
                onClick={() => {
                  // console.log(restrict)
                  let placeIds: string[];
                  let userIds: string[];
                  placeIds = [];
                  userIds = [];
                  if (restrict === "no") {
                    // console.log("all user")
                    for (
                      let index = 0;
                      index < formData.places.length;
                      index++
                    ) {
                      const element = formData.places[index];
                      placeIds.push(element.id);
                    }
                    // console.log(placedata)
                  }
                  if (restrict == "byUser") {
                    // console.log("some user")
                    for (
                      let index = 0;
                      index < formData.users.length;
                      index++
                    ) {
                      const element = formData.users[index];
                      userIds.push(element?.id || "");
                    }
                    // console.log(userIds)
                    if (userIds[0] === "" || userIds.length === 0) {
                      return alert(`Please select user`);
                    }
                  }
                  p.handleSave(formData, {
                    restrict,
                    placeIds,
                    userIds,
                  });
                }}
                fullWidth
                variant="contained"
                css={css`
                  &.MuiButtonBase-root {
                    text-transform: none;
                    background-color: var(--primary);
                    color: white;
                    height: 50px;
                    font-weight: 700;
                  }
                `}
              >
                {p.saving && (
                  <Box mr={2}>
                    <CircularProgress size="1rem" color="inherit" />
                  </Box>
                )}
                SAVE
              </Button>
            </Box>
          </Box>
        </div>
        <DatagridSearchModal
          closeModal={() => set_openUserModal(false)}
          open={openUserModal}
          values={(g.geofenceForm.users || []).map((id) => id)}
          rows={alluserinplace}
          cols={[
            {
              field: "Name",
              width: 300,
              renderCell: (params: CellParams) => (
                <strong style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    css={{ width: 32, height: 32, marginRight: 10 }}
                    src={params.row.avatar}
                  >
                    {params.row.name.substring(0, 1)}
                  </Avatar>
                  {[
                    params.row.title_name,
                    params.row.name,
                    params.row.surname,
                  ].join(" ")}
                </strong>
              ),
            },
            { field: "surname", width: 200 },
            { field: "phone_number", width: 200 },
            { field: "age", width: 200 },
            { field: "nationality", width: 200 },

            { field: "date_of_birth", width: 200 },
            { field: "email", width: 200 },
            { field: "gender", width: 200 },
          ]}
          onSubmit={(value) => {
            console.log("value", value);
            formData.users = value;
            g.refreshForm();
          }}
        />
        <DatagridSearchModal
          closeModal={() => set_openPlaceModal(false)}
          open={openPlaceModal}
          rows={placeslist}
          cols={[
            { field: "name_th", width: 200 },
            { field: "name_en", width: 200 },
            { field: "created_at", width: 200 },
          ]}
          values={(g.geofenceForm.places || []).map((id) => id)}
          onSubmit={(value) => {
            console.log("value", value);
            formData.places = value;
            g.refreshForm();
          }}
        />
      </Paper>
    );
  }
);
type DatagridSearch = {
  open: boolean;
  values: any[];
  cols: ColDef[];
  rows: any[];

  onSubmit: (t: any[]) => void;
  closeModal: () => void;
};
export const DatagridSearchModal = (p: DatagridSearch) => {
  const g = useGeofenceContext();
  if (!g.geofenceForm) {
    return <></>;
  }
  return (
    <Dialog
      open={p.open}
      onClose={p.closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      maxWidth={"xl"}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div style={{ width: "80vw", padding: "3rem" }}>
        {p.open ? <DatagridSearchModalInner {...p} /> : <></>}
      </div>
    </Dialog>
  );
};
const DatagridSearchModalInner = (p: DatagridSearch) => {
  const [keyword, onSearch] = useState("");
  const apiRef = React.useRef<any>(null);
  const [rowIds, setSelection] = React.useState<(string | number)[]>(
    p.values.map(({ id }) => id)
  );
  const [_rows, setRows] = useState<any[]>([]);
  const [apiReady, setApiReady] = useState<boolean>(false);
  const toggle = (rowId: string | number) => {
    if (rowIds.indexOf(rowId) >= 0) {
      setSelection(rowIds.filter((r) => r !== rowId));
    } else {
      setSelection([...rowIds, rowId]);
    }
  };
  const toggleAll = () => {
    let isSelectAll = _.every(p.rows, (r) => rowIds.indexOf(r.id) >= 0);
    if (isSelectAll) {
      setSelection([]);
    } else {
      setSelection([...p.rows.map((r) => r.id)]);
    }
  };
  useEffect(() => {
    setRows([
      ...p.rows.filter((r) => {
        if (!r) {
          return false;
        }
        const search = _.values(r)
          .filter(
            (k) =>
              k && typeof k === "string" && k.indexOf && k.indexOf("_at") < 0
          )
          .join("");

        return (
          search.indexOf(keyword) >= 0 ||
          search.toUpperCase().indexOf(keyword) >= 0 ||
          search.toLowerCase().indexOf(keyword) >= 0 ||
          search.toUpperCase().indexOf(keyword.toLowerCase()) >= 0 ||
          search.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
          search.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ||
          search.toLowerCase().indexOf(keyword.toUpperCase()) >= 0 ||
          !keyword
        );
      }),
    ]);
  }, [keyword]);

  useEffect(() => {
    if (!apiReady) {
      return;
    }
    const rows = apiRef.current?.getRowModels();
    const selectedIds: any[] = [];

    rows?.forEach((r: any) => {
      if (rowIds.indexOf(r.id) >= 0) {
        selectedIds.push(r.id);
      }
    });

    apiRef.current?.selectRows(selectedIds);
  }, [_rows, apiReady, rowIds]);

  return (
    <div>
      <DialogContentText>
        <Box css={{ backgroundColor: "#fff" }} borderRadius={2}>
          <TextField
            type="search"
            id="outlined-basic"
            label="Search"
            variant="outlined"
            style={{ width: "30%" }}
            onChange={(e: any) => onSearch(e.target.value)}
          />
        </Box>
      </DialogContentText>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          checkboxSelection
          onColumnHeaderClick={(param) => {
            if (param.field === "__check__") {
              toggleAll();
            }
          }}
          onRowSelected={(param) => {
            toggle(param.data.id);
          }}
          components={{
            noRowsOverlay: (params: any) => {
              if (!apiRef.current) {
                apiRef.current = params.api.current;
                setApiReady(true);
              }
              return <div></div>;
            },
          }}
          rows={_rows}
          columns={p.cols}
        />
      </div>
      <DialogActions>
        <Button
          onClick={() => {
            console.log("rowIds", rowIds);
            p.onSubmit(p.rows.filter((r) => rowIds.indexOf(r.id) >= 0));
            p.closeModal();
          }}
          color="primary"
        >
          Submit
        </Button>
        <Button onClick={p.closeModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </div>
  );
};
