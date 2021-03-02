import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@material-ui/core";
import { AddIcon } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useListBranches } from "../../../services/api/user/useListBranches";
import { SubBar } from "../../Dashboard/Dashboard";
import { GEOFENCE_PAGE_MODE, useGeofenceContext } from "./GeofenceFormWrapper";

export const GeoFenceBranchIdSelector = () => {


  // console.log("Project-Key:"+localStorage.getItem("projectKey"))
  // console.log("Token-Key:"+localStorage.getItem("token"))
  const g = useGeofenceContext();
  const {
    result_branches,
    loading_branches,
    error_branches,
  } = useListBranches();
  useEffect(() => {
    if (result_branches && result_branches[0] && !g.branchId) {
      let name: any;
      let search = window.location.search; // could be '?foo=bar'
      let params = new URLSearchParams(search);
      let branchId = params.get("b");
      const b =
        result_branches.find((bb) => bb.id === branchId) || result_branches[0];
      if (b) {
        g.setCurrentBranchId(b.id);
      }
    }
  }, [result_branches]);
  return (
    <FormControl
      variant="outlined"
      style={{ width: "100%", marginLeft: "2rem" }}
      disabled={(result_branches || []).length === 0}
      required={true}
      size="small"
      margin="dense"
    >
      <InputLabel id="demo-simple-select-outlined-label">
        Select branch
      </InputLabel>
      <Select
        disabled={(result_branches || []).length === 0}
        labelId="demo-simple-select-outlined-label"
        label="Select branch"
        name="branch"
        value={g.branchId || ""}
        onChange={(e: any) => {
          g.setCurrentBranchId(e.target.value);
        }}
        fullWidth
        required={true}
      >
        {result_branches?.map((v: any) => {
          return <MenuItem value={v.id}>{v.name_en}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export const GeoFenceHeader = () => {
  const g = useGeofenceContext();
  const history = useHistory();
  return (
    <SubBar
      reload={false}
      back={true}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {`GEOFENCE ${g.mode.toUpperCase()}`}
          <GeoFenceBranchIdSelector />
        </div>
      }
    >
      {g.mode === GEOFENCE_PAGE_MODE.LIST ? (
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
              history.push(
                `/setting/geofence/${GEOFENCE_PAGE_MODE.add}?b=${g.branchId}`
              );
            }}
          >
            ADD NEW FENCE
          </Button>
        </Box>
      ) : (
          <></>
        )}
    </SubBar>
  );
}; //
