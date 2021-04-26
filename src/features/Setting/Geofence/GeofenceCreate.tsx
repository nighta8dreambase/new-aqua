import { Grid } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCreateGeofence } from "../../../services/api/geofence/useCreateGeofence";
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

export const GeofenceCreateInner = observer((props: any) => {
  const history = useHistory();
  const [saving, setSaving] = useState<boolean>(false);
  const g = useGeofenceContext();
  const { fire_geofence_create, loading_geofence_create } = useCreateGeofence();
  const {
    fire_geofence_update,
    fire_geofence_insert_all_user,
    fire_geofence_insert_custom_user,
    loading_geofence_update,
  } = useUpdateGeofence();
  const [mapCenterLat, setMapCenterLat] = useState(Number);
  const [mapCenterLong, setMapCenterLong] = useState(Number);

  useEffect(() => {
    setMapCenterLat(13.736717); // default center lat : thailand
    setMapCenterLong(100.523186); // default center long : thailand
  }, []);

  useEffect(() => {
    /*
        FORM INITIAL VALUE
      */
    g.setFormInitialData();
  }, []);
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
          saving={saving}
          handleSave={(d, f) => {
            if (!d) {
              return;
            }
            setSaving(true);
            let p;
            p = fire_geofence_create({
              name: d.geofence.name || "",
              type: d.geofence.radius ? "radius" : "polygon",
              address: "",
              radius: d.geofence.radius,
              max_distance:
                (d.geofence.max_distance || 0) * (d.distype === "m" ? 1 : 1000),
              coordinates: d.geofence.coordinates,
              branch_id: g.branchId || "",
            });
            p.then(({ data }: any) => {
              if (data.code === 0 && data.message) {
                g.enqueueSnackbar(data.message, {
                  key: "GeofenceError",
                  variant: "error",
                  autoHideDuration: 3000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center",
                  },
                });
              } else {
                let geofence_id: string;
                geofence_id = data.data.id;
                console.log("geofence_id:" + geofence_id);
                if (f.restrict === "no") {
                  // console.log("All user in branch")

                  let inst: any;
                  inst = fire_geofence_insert_all_user(geofence_id, f.placeIds);
                  inst.then(({ data }: any) => {
                    console.log(data);
                    history.push("/setting/geofence");
                    g.enqueueSnackbar(`Edit success`, {
                      variant: "success",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    });
                    setSaving(false);
                  });
                }
                if (f.restrict == "byUser") {
                  console.log("some user");

                  let inst: any;
                  inst = fire_geofence_insert_custom_user(
                    geofence_id,
                    f.userIds
                  );
                  inst.then(({ data }: any) => {
                    console.log(data);
                    history.push("/setting/geofence");
                    g.enqueueSnackbar(`Create success`, {
                      variant: "success",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    });
                    setSaving(false);
                  });
                }
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
              setSaving(false);
            });
            return;
          }}
        />
      </Grid>
    </Grid>
  );
});

export const GeofenceCreate = observer((props: any) => {
  return (
    <GeofenceWrapper mode={GEOFENCE_PAGE_MODE.add}>
      <GeofenceCreateInner />
    </GeofenceWrapper>
  );
});
