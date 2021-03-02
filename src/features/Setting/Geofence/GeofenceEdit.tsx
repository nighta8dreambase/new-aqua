import { Grid } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useUpdateGeofence } from "../../../services/api/geofence/useUpdateGeofence";
import { webStore } from "../../../stores/webStore";
import { GeofenceMapView } from "./GefenceMapView";
import { GeofenceForm } from "./GeofenceForm";
import {
  GeofenceWrapper,
  GEOFENCE_PAGE_MODE,
  useGeofenceContext,
} from "./GeofenceFormWrapper";
import { GeoFenceHeader } from "./GeofenceHeader";
import { GeofenceToolbar } from "./GeofenceToolbar";

export const GeofenceEditInner = observer((props: any) => {
  const g = useGeofenceContext();
  const { id }: any = useParams();
  const history = useHistory();
  const {
    fire_geofence_update,
    fire_geofence_insert_all_user,
    fire_geofence_insert_custom_user,
    loading_geofence_update,
  } = useUpdateGeofence();
  const [mapCenterLat, setMapCenterLat] = useState(Number);
  const [mapCenterLong, setMapCenterLong] = useState(Number);

  useEffect(() => {
    if (
      !g.geofenceForm &&
      id &&
      g.result_geofenceList &&
      g.result_geofenceList.length > 0
    ) {
      /*
        FORM INITIAL VALUE
      */
      let found = g.result_geofenceList.find((g) => g.id === id);

      if (found) {
        setMapCenterLat(found.coordinates[0].lat); // default center lat : thailand
        setMapCenterLong(found.coordinates[0].lng);
        g.setGeofenceFormData({
          geofence: found,
          places: [],
          users: [],
          distype: "m",
        });
      }
    }
  }, [id, g.result_geofenceList, g.geofenceForm]);
  console.log("mapCenterLat", "mapCenterLong", mapCenterLat, mapCenterLong);
  return (
    <Grid container spacing={4}>
      <Grid xs={12} style={{ marginBottom: "1rem" }}>
        <GeoFenceHeader />
      </Grid>
      <GeofenceToolbar />
      <Grid
        container
        className="gap-4"
        wrap={webStore.device === "mobile" ? "wrap" : "nowrap"}
      >
        <Grid className="lg:w-8/12 w-full">
          <GeofenceMapView data={{ lat: mapCenterLat, long: mapCenterLong }} />
        </Grid>
        <GeofenceForm
          saving={loading_geofence_update}
          handleSave={async (d, f) => {
            if (!d || !g.geofenceForm?.geofence.id) {
              return;
            }
            let p = fire_geofence_update({
              id: g.geofenceForm?.geofence.id || "",
              name: d.geofence.name || "",
              type: d.geofence.radius ? "radius" : "polygon",
              address: "",
              radius: d.geofence.radius,
              max_distance:
                (d.geofence.max_distance || 0) * (d.distype === "m" ? 1 : 1000),
              coordinates: d.geofence.coordinates || [],
              branch_id: g.branchId || "",
            });
            p.then(({ code, message, data }: any) => {
              // console.log( "Update");
              // console.log( data,code,message);
              // console.log( "Update");
              if (code === 0 && message) {
                g.enqueueSnackbar(message, {
                  key: "GeofenceError",
                  variant: "error",
                  autoHideDuration: 3000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                  },
                });
              } else {
                g.enqueueSnackbar(`Edit success`, {
                  variant: "success",
                  autoHideDuration: 3000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                });
                history.push("/setting/geofence"); //
              }
            }).catch((ex: any) => {
              g.enqueueSnackbar(ex, {
                key: "GeofenceError",
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });
            });
          }}
        />
      </Grid>
    </Grid>
  );
});

export const GeofenceEdit = observer((props: any) => {
  return (
    <GeofenceWrapper mode={GEOFENCE_PAGE_MODE.edit}>
      <GeofenceEditInner />
    </GeofenceWrapper>
  );
});
