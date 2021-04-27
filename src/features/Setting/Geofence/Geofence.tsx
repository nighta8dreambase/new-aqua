import { Grid, Paper } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React from "react";
import { webStore } from "../../../stores/webStore";
import { GeofenceMapView } from "./GefenceMapView";
import { GeofenceWrapper, GEOFENCE_PAGE_MODE } from "./GeofenceFormWrapper";
import { GeoFenceHeader } from "./GeofenceHeader";
import { GeofenceList } from "./GeofenceList";
import { GeofenceToolbar } from "./GeofenceToolbar";
import { useEffect, useState } from "react";
export const Geofence = observer(() => {
  const [mapCenterLat, setMapCenterLat] = useState(Number);
  const [mapCenterLong, setMapCenterLong] = useState(Number);

  useEffect(() => {
    console.log("set default center");
    setMapCenterLat(13.736717); // default center lat : thailand
    setMapCenterLong(100.523186); // default center long : thailand
  }, []);
  console.log("mapCenterLat", "mapCenterLong", mapCenterLat, mapCenterLong);

  return (
    <GeofenceWrapper mode={GEOFENCE_PAGE_MODE.LIST}>
      <Grid container spacing={4}>
        <Grid xs={12} style={{ marginBottom: "1rem" }}>
          <GeoFenceHeader />
        </Grid>
        {/* <GeofenceToolbar /> */}
        <Grid
          container
          className="gap-4"
          wrap={webStore.device === "mobile" ? "wrap" : "nowrap"}
        >
          <Grid className="lg:w-8/12 w-full">
            <GeofenceMapView
              data={{ lat: mapCenterLat, long: mapCenterLong }}
            />
          </Grid>
          <GeofenceList
            setmapcenterlat={setMapCenterLat}
            setmapcenterlong={setMapCenterLong}
          />
        </Grid>
      </Grid>
    </GeofenceWrapper>
  );
});
