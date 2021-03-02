import { Grid, Box, Button } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React from "react";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import GestureIcon from "@material-ui/icons/Gesture";
import { useGeofenceContext } from "./GeofenceFormWrapper";
export const GeofenceToolbar = observer(() => {
  const g = useGeofenceContext();
  return (
    <div className={`w-full`}>
      <Grid container>
        <Grid className="lg:w-8/12 w-full px-4 lg:px-0 mb-3">
          <div className={`${g.isDrawing ? "hidden" : ""}`}>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Box mr={2}>
                  <Button
                    id="draw"
                    startIcon={
                      <GestureIcon
                        css={{
                          color: g.isDrawing ? "white" : "var(--primary)",
                        }}
                      />
                    }
                    css={{
                      color: g.isDrawing ? "white" : "var(--primary)",
                      backgroundColor: g.isDrawing ? "var(--primary)" : "",
                    }}
                  >
                    POLYGON
                  </Button>
                </Box>
                <Box mr={2}>
                  <Button
                    id="circle"
                    startIcon={
                      <RadioButtonUncheckedIcon
                        css={{
                          color: g.isDrawing ? "white" : "var(--primary)",
                        }}
                      />
                    }
                    css={{
                      color: g.isDrawing ? "white" : "var(--primary)",
                      backgroundColor: g.isDrawing ? "var(--primary)" : "",
                    }}
                  >
                    CIRCLE
                  </Button>
                </Box>
              </Box>
              <Box>
                <Button variant="contained" id="clearall">
                  CLEAR ALL
                </Button>
              </Box>
            </Box>
          </div>
          <div className={`${g.isDrawing ? "" : "hidden"}`}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                Tap on map to draw the geofence c. If you complete, click
                'APPLY' to confirm your drawing.
              </Box>
              <Box>
                <Button variant="contained" color="primary" id="apply">
                  APPLY
                </Button>
              </Box>
            </Box>
          </div>
        </Grid>
        <Grid className="w-1/4 lg:block hidden"></Grid>
      </Grid>
    </div>
  );
});
