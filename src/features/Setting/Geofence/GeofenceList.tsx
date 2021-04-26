import { Paper, Box, Grid } from "@material-ui/core";
import { CloseIcon } from "@material-ui/data-grid";
import { observer } from "mobx-react-lite";
import React from "react";
import { GEOFENCE_PAGE_MODE, useGeofenceContext } from "./GeofenceFormWrapper";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";

type Props = {
  setmapcenterlat: React.Dispatch<React.SetStateAction<any>>;
  setmapcenterlong: React.Dispatch<React.SetStateAction<any>>;
};
export const GeofenceList: React.FC<Props> = observer( ({setmapcenterlat,setmapcenterlong} ) => {
  const g = useGeofenceContext();
  const geofences = g.result_geofenceList;
  const saving = g.loading_geofence_delete;
  const history = useHistory();

  const onMouseOver =(i:any)=> {
    setmapcenterlat(i.coordinates[0].lat)
    setmapcenterlong(i.coordinates[0].lng)
  };

  return (
    <Paper className="lg:w-4/12 w-full">
      <div className="bg-white rounded-lg">
        <Box className="text-sm" css={{ color: "#4B4C56" }} p={1}>
          {geofences.map((d, i) => {
            return (
              <Box
                css={{ opacity: saving ? 0.25 : 1 }}
                mb={1}
                p={1}
                className={`rounded-lg ${g.classes.geofenceCard} fencecard`}
                key={i}
                onMouseOver={(e)=>onMouseOver(d)}
              >
                <Grid container wrap="nowrap" alignItems="center">
                  <Grid container direction="column">
                    <Box fontWeight={700}>{d.name}</Box>
                    <Box>&lt; {d.max_distance || "? "}km</Box>
                  </Grid>
                  <Grid container justify="flex-end">
                    <Box mr={1}>
                      <EditIcon
                        onClick={() => {
                          history.push(
                            `/setting/geofence/${GEOFENCE_PAGE_MODE.edit}/${d.id}?b=${g.branchId}`
                          );
                        }}
                        css={{ color: "#83858F" }}
                        fontSize="small"
                        className="cursor-pointer"
                      />
                    </Box>
                    <Box>
                      <CloseIcon
                        onClick={() => {
                          if (!saving) {
                            g.fire_geofence_delete(d)
                              .then(({ data: { code, message } }) => {
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
                                }
                                g.fire_geofenceList();
                              })
                              .catch((ex) => {
                                g.enqueueSnackbar(ex.toString(), {
                                  key: "GeofenceError",
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
                        css={{
                          color: "#83858F",
                        }}
                        fontSize="small"
                        className="cursor-pointer"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </div>
    </Paper>
  );
});
