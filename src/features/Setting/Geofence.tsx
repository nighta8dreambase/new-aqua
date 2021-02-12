import React, { Component, useEffect, useRef, useState } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import { useHistory } from "react-router-dom";
import GestureIcon from "@material-ui/icons/Gesture";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { Theme } from "@emotion/react";
import { useListAllUser } from "../../services/api/user/useListAllUser";
import { useListAllGeofence } from "../../services/api/geofence/useListAllGeofence";
import { useCreateGeofence } from "../../services/api/geofence/useCreateGeofence";
import { useUpdateGeofence } from "../../services/api/geofence/useUpdateGeofence";
import { useDeleteGeofence } from "../../services/api/geofence/useDeleteGeofence";
import { useListBranches } from "../../services/api/user/useListBranches";
import { useSnackbar } from "notistack";
import { GeofenceCreateInput } from "../../types/geofence";

export const Geofence = observer((props: any) => {
  const mobile = webStore.device === "mobile";
  const history = useHistory();
  const [toggleDraw, setToggleDraw] = useState(false);
  const [toggleCircle, setToggleCircle] = useState(false);
  const [name, setName]: any = useState("");
  const [maximumDistance, setMaximumDistance]: any = useState("");
  const [coords, setCoords]: any = useState(null);
  const [circle, setCircle]: any = useState(null);
  const [branch_id, setBranchId] = useState<string>("");

  const correctPath = "/setting/geofence";
  const pathName = history.location.pathname.replace(correctPath, "");
  enum GEOFENCE_OPERATION {
    VIEW = "VIEW",
    ADD = "ADD",
    EDIT = "EDIT",
  }

  let OPERATION: any;
  let geoId: any;
  if (pathName === "" || pathName === "/") {
    OPERATION = GEOFENCE_OPERATION.VIEW;
  } else if (pathName.startsWith("/add")) {
    OPERATION = GEOFENCE_OPERATION.ADD;
  } else if (pathName.startsWith("/edit/")) {
    OPERATION = GEOFENCE_OPERATION.EDIT;
    geoId = pathName.replace("/edit/", "");
  }

  const { result_userList, loading_userList, total } = useListAllUser();
  const {
    result_geofenceList,
    loading_geofenceList,
    fire_geofenceList,
  } = useListAllGeofence();
  const { enqueueSnackbar } = useSnackbar();
  const { fire_geofence_create, loading_geofence_create } = useCreateGeofence();
  const { fire_geofence_update, loading_geofence_update } = useUpdateGeofence();
  const { fire_geofence_delete, loading_geofence_delete } = useDeleteGeofence();

  const saving =
    loading_geofence_create ||
    loading_geofence_update ||
    loading_geofence_delete ||
    loading_geofenceList;

  let geofences = result_geofenceList;

  let editGeofence = geofences.find((geo: any, i) => {
    return geoId && geo.id.toString() === geoId.toString();
  });
  console.log("editGeofence", editGeofence);
  if (OPERATION === GEOFENCE_OPERATION.EDIT) {
    geofences = editGeofence ? [editGeofence] : [];
  }
  useEffect(() => {
    if (OPERATION === GEOFENCE_OPERATION.EDIT && editGeofence) {
      setName(editGeofence.name);
      setMaximumDistance(editGeofence.maximumDistance);
      setCoords(editGeofence.coordinates);
      setCircle(editGeofence.radius);
    }
  }, [editGeofence, loading_geofenceList]);

  const useStyles = makeStyles((theme: Theme) => ({
    textfield: {
      height: 10,
    },
    geofenceCard: {
      "&:hover": {
        backgroundColor: "#F4F5FC !important",
        color: "var(--primary)",
      },
    },
  }));

  const classes = useStyles();

  const handleSave = () => {
    if (
      !name ||
      !maximumDistance ||
      (!coords && !circle) ||
      toggleCircle ||
      toggleDraw
    ) {
      if (toggleCircle || toggleDraw) {
        alert(`Please click 'APPLY' button to confirm drawing first`);
      } else if (!name || !maximumDistance) {
        alert(`Please enter 'Name' & 'Maximum distance' before clicking save`);
      } else {
        alert(`Please draw something before clicking save`);
      }
    } else {
      if (!saving) {
        console.log("name", name);
        console.log("maximumdistance", maximumDistance);
        console.log("coords", coords);
        console.log("circle", circle);
        let p: any;
        if (OPERATION === GEOFENCE_OPERATION.ADD) {
          p = fire_geofence_create({
            name,
            type: circle ? "radius" : "polygon",
            address: "",
            radius: circle,
            maximumDistance: maximumDistance,
            coordinates: coords,
            branch_id: branch_id,
          });
        } else if (OPERATION === GEOFENCE_OPERATION.EDIT && editGeofence) {
          p = fire_geofence_update(editGeofence);
        }
        if (p) {
          p.then(({ code, message }: any) => {
            console.log("code", code);
            if (code === 0 && message) {
              enqueueSnackbar(message, {
                key: "GeofenceError",
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });
            } else {
              history.push("/setting/geofence"); //
            }
          }).catch((ex: any) => {
            enqueueSnackbar(ex, {
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
      } else {
        console.log("ใจเย็นพ่อหนุ่ม รีบร้อนจังเลย");
      }
    }
  };

  return (
    <Container maxWidth="lg" className="py-4">
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
                {`${
                  OPERATION === GEOFENCE_OPERATION.VIEW ? "" : OPERATION + " "
                }GEOFENCE`}
                <GeoFenceBranchIdSelector
                  branch_id={branch_id}
                  setBranchId={setBranchId}
                />
              </div>
            }
            addNewFence={
              OPERATION === GEOFENCE_OPERATION.VIEW
                ? "/setting/geofence/add"
                : ""
            }
          />
        </Grid>
        <div
          className={`${
            OPERATION === GEOFENCE_OPERATION.ADD ? "" : "hidden"
          } w-full`}
        >
          <Grid container>
            <Grid className="lg:w-3/4 w-full px-4 lg:px-0 mb-3">
              <div className={`${toggleDraw || toggleCircle ? "hidden" : ""}`}>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex">
                    <Box mr={2}>
                      <Button
                        id="draw"
                        startIcon={
                          <GestureIcon
                            css={{
                              color: toggleDraw ? "white" : "var(--primary)",
                            }}
                          />
                        }
                        css={{
                          color: toggleDraw ? "white" : "var(--primary)",
                          backgroundColor: toggleDraw ? "var(--primary)" : "",
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
                              color: toggleCircle ? "white" : "var(--primary)",
                            }}
                          />
                        }
                        css={{
                          color: toggleCircle ? "white" : "var(--primary)",
                          backgroundColor: toggleCircle ? "var(--primary)" : "",
                        }}
                      >
                        CIRCLE
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <Button id="clearall" css={{ color: "var(--primary)" }}>
                      CLEAR ALL
                    </Button>
                  </Box>
                </Box>
              </div>
              <div className={`${toggleDraw || toggleCircle ? "" : "hidden"}`}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    Please tap on the map to add ploygon point. If you complete,
                    click 'APPLY' to confirm your drawing.
                  </Box>
                  <Box>
                    <Button id="apply" css={{ color: "var(--primary)" }}>
                      APPLY
                    </Button>
                  </Box>
                </Box>
              </div>
            </Grid>
            <Grid className="w-1/4 lg:block hidden"></Grid>
          </Grid>
        </div>
        <Grid container className="gap-4" wrap={mobile ? "wrap" : "nowrap"}>
          <Grid
            key={
              (geofences || []).map(({ id }) => id).join(",") + ":" + OPERATION
            }
            className="lg:w-3/4 w-full"
          >
            {!loading_userList && !loading_geofenceList ? (
              <GeofenceMap
                users={result_userList}
                geofences={geofences}
                setCircle={setCircle}
                setCoords={setCoords}
                setToggleDraw={setToggleDraw}
                setToggleCircle={setToggleCircle}
                editGeofence={editGeofence}
              />
            ) : (
              ""
            )}
          </Grid>
          {OPERATION === GEOFENCE_OPERATION.ADD ||
          OPERATION === GEOFENCE_OPERATION.EDIT ? (
            <Paper className="lg:w-1/4 w-full lg:max-h-0">
              <div className="bg-white rounded-lg">
                <Box className="text-base" css={{ color: "#4B4C56" }} p={2}>
                  <Box mb={3}>Geofencer Information</Box>
                  <Box mb={2}>
                    <TextField
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      InputProps={{ classes: { input: classes.textfield } }}
                      id="name"
                      placeholder="Name *"
                      variant="outlined"
                      css={{ width: "100%" }}
                    />
                  </Box>
                  <Box mb={6}>
                    <TextField
                      value={maximumDistance}
                      onChange={(e) => {
                        setMaximumDistance(e.target.value);
                      }}
                      InputProps={{
                        classes: { input: classes.textfield },
                        endAdornment: (
                          <InputAdornment position="start">KM</InputAdornment>
                        ),
                      }}
                      type="number"
                      id="MaximumDistance"
                      placeholder="Maximum distance *"
                      variant="outlined"
                      css={{ width: "100%" }}
                    />
                  </Box>
                  <Button
                    onClick={handleSave}
                    fullWidth
                    variant="contained"
                    css={{
                      textTransform: "none",
                      backgroundColor: "var(--primary)",
                      color: "white",
                      height: 50,
                      fontWeight: 700,
                    }}
                  >
                    {saving && (
                      <Box mr={2}>
                        <CircularProgress size="1rem" color="inherit" />
                      </Box>
                    )}
                    SAVE
                  </Button>
                </Box>
              </div>
            </Paper>
          ) : (
            ""
          )}
          {OPERATION === GEOFENCE_OPERATION.VIEW ? (
            <Paper className="lg:w-1/4 w-full">
              <div className="bg-white rounded-lg">
                <Box className="text-sm" css={{ color: "#4B4C56" }} p={1}>
                  {geofences.map((d, i) => {
                    return (
                      <Box
                        css={{ opacity: saving ? 0.25 : 1 }}
                        mb={1}
                        p={1}
                        className={`rounded-lg ${classes.geofenceCard} fencecard`}
                        key={i}
                      >
                        <Grid container wrap="nowrap" alignItems="center">
                          <Grid container direction="column">
                            <Box fontWeight={700}>{d.name}</Box>
                            <Box>&lt; {d.maximumDistance || "? "}km</Box>
                          </Grid>
                          <Grid container justify="flex-end">
                            <Box mr={1}>
                              <EditIcon
                                onClick={() => {
                                  window.open(
                                    `/setting/geofence/edit/${d.id}`,
                                    "_self"
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
                                    fire_geofence_delete(d)
                                      .then(({ data: { code, message } }) => {
                                        if (code === 0 && message) {
                                          enqueueSnackbar(message, {
                                            key: "GeofenceError",
                                            variant: "error",
                                            autoHideDuration: 3000,
                                            anchorOrigin: {
                                              vertical: "top",
                                              horizontal: "center",
                                            },
                                          });
                                        }
                                        fire_geofenceList();
                                      })
                                      .catch((ex) => {
                                        enqueueSnackbar(ex.toString(), {
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
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Container>
  );
});

export const GeofenceMap = (props: any) => {
  const users = props.users;
  const geofences = props.geofences;
  const setCircle = props.setCircle;
  const setCoords = props.setCoords;
  const setToggleDraw = props.setToggleDraw;
  const setToggleCircle = props.setToggleCircle;
  const editGeofence = props.editGeofence;

  const initMap = () => {
    let centerLat = 0,
      centerLng = 0;
    let latLngCount = 0;
    geofences.map((d: any, i: any) => {
      d.coordinates.map((j: any, k: any) => {
        centerLat += j.lat;
        centerLng += j.lng;
      });
      latLngCount += d.coordinates.length;
    });
    if (latLngCount > 0) {
      centerLat /= latLngCount;
      centerLng /= latLngCount;
    }

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: centerLat, lng: centerLng },
        zoom: 6,
        gestureHandling: "greedy",
        mapTypeControlOptions: { mapTypeIds: [] },
        streetViewControl: false,
        fullscreenControl: false,
      }
    );

    if (users) {
      users.map((d: any, i: any) => {
        if (d.device) {
          new google.maps.Marker({
            position: { lat: d.device.latitude, lng: d.device.longitude },
            map,
          });
        }
      });
    }

    let dump_count = 0;
    geofences.map((d: any, i: any) => {
      const fenceCards: any = document.getElementsByClassName("fencecard");
      const fenceCard = fenceCards[dump_count++];
      if (d.radius) {
        const circle = new google.maps.Circle({
          fillColor:
            editGeofence && d.id === editGeofence.id
              ? "rgba(70,132,226,0.3)"
              : "#96989A",
          fillOpacity: editGeofence && d.id === editGeofence.id ? 1 : 0.1,
          strokeWeight: 2,
          strokeColor:
            editGeofence && d.id === editGeofence.id ? "#4684E2" : "#43444B",
          strokeOpacity: editGeofence && d.id === editGeofence.id ? 1 : 0.2,
          center: {
            lat: d.coordinates[0].lat,
            lng: d.coordinates[0].lng,
          },
          radius: d.radius,
          editable: editGeofence && d.id === editGeofence.id ? true : false,
        });
        circle.setMap(map);
        if (fenceCard) {
          google.maps.event.addDomListener(fenceCard, "mouseover", function () {
            circle.setOptions({
              fillColor: "rgba(70,132,226,0.3)",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeOpacity: 1,
              strokeColor: "#4684E2",
            });
          });
          google.maps.event.addDomListener(fenceCard, "mouseout", function () {
            circle.setOptions({
              fillColor: "#96989A",
              fillOpacity: 0.1,
              strokeWeight: 2,
              strokeColor: "#43444B",
              strokeOpacity: 0.2,
            });
          });
        }
        if (editGeofence && d.id === editGeofence.id) {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
          setCoords(null);
        }
        google.maps.event.addListener(circle, "radius_changed", function () {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
          setCoords(null);
        });
        google.maps.event.addListener(circle, "center_changed", function () {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
          setCoords(null);
        });
      } else {
        const shape = new google.maps.Polygon({
          paths: d.coordinates,
          fillColor:
            editGeofence && d.id === editGeofence.id
              ? "rgba(70,132,226,0.3)"
              : "#96989A",
          fillOpacity: editGeofence && d.id === editGeofence.id ? 1 : 0.1,
          strokeWeight: 2,
          strokeColor:
            editGeofence && d.id === editGeofence.id ? "#4684E2" : "#43444B",
          strokeOpacity: editGeofence && d.id === editGeofence.id ? 1 : 0.2,
          editable: editGeofence && d.id === editGeofence.id ? true : false,
        });
        shape.setMap(map);
        if (fenceCard) {
          google.maps.event.addDomListener(fenceCard, "mouseover", function () {
            shape.setOptions({
              fillColor: "rgba(70,132,226,0.3)",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeOpacity: 1,
              strokeColor: "#4684E2",
            });
          });
          google.maps.event.addDomListener(fenceCard, "mouseout", function () {
            shape.setOptions({
              fillColor: "#96989A",
              fillOpacity: 0.1,
              strokeWeight: 2,
              strokeColor: "#43444B",
              strokeOpacity: 0.2,
            });
          });
        }
        google.maps.event.addListener(
          shape.getPath(),
          "insert_at",
          function (index, obj) {
            const coords = shape
              .getPath()
              .getArray()
              .map((coord: any) => {
                return {
                  lat: coord.lat(),
                  lng: coord.lng(),
                };
              });
            setCoords(coords);
            setCircle(null);
          }
        );
        google.maps.event.addListener(
          shape.getPath(),
          "set_at",
          function (index, obj) {
            const coords = shape
              .getPath()
              .getArray()
              .map((coord: any) => {
                return {
                  lat: coord.lat(),
                  lng: coord.lng(),
                };
              });
            setCoords(coords);
            setCircle(null);
          }
        );
        const coords = shape
          .getPath()
          .getArray()
          .map((coord: any) => {
            return {
              lat: coord.lat(),
              lng: coord.lng(),
            };
          });
        if (editGeofence && d.id === editGeofence.id) {
          setCoords(coords);
          setCircle(null);
        }
      }
    });

    map.setCenter({ lat: centerLat, lng: centerLng });

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        fillColor: "rgba(70,132,226,0.3)",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#4684E2",
        clickable: false,
        editable: true,
        zIndex: 1,
      },
      circleOptions: {
        fillColor: "rgba(70,132,226,0.3)",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#4684E2",
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    drawingManager.setMap(map);

    let lastOverlay: any;

    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      function (event: any) {
        if (lastOverlay) {
          lastOverlay.setMap(null);
        }
        event.overlay.overlayType = event.type;
        lastOverlay = event.overlay; // Save it
        if (event.type === "circle") {
          const circle = event.overlay;
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
          setCoords(null);
          google.maps.event.addListener(circle, "radius_changed", function () {
            setCircle({
              radius: circle.getRadius(),
              lat: circle.getCenter().lat(),
              lng: circle.getCenter().lng(),
            });
            setCoords(null);
          });
          google.maps.event.addListener(circle, "center_changed", function () {
            setCircle({
              radius: circle.getRadius(),
              lat: circle.getCenter().lat(),
              lng: circle.getCenter().lng(),
            });
            setCoords(null);
          });
        } else {
          const polygon = event.overlay;
          const coords = polygon
            .getPath()
            .getArray()
            .map((coord: any) => {
              return {
                lat: coord.lat(),
                lng: coord.lng(),
              };
            });
          setCoords(coords);
          setCircle(null);
          google.maps.event.addListener(
            polygon.getPath(),
            "insert_at",
            function (index, obj) {
              const coords = polygon
                .getPath()
                .getArray()
                .map((coord: any) => {
                  return {
                    lat: coord.lat(),
                    lng: coord.lng(),
                  };
                });
              setCoords(coords);
              setCircle(null);
            }
          );
          google.maps.event.addListener(
            polygon.getPath(),
            "set_at",
            function (index, obj) {
              const coords = polygon
                .getPath()
                .getArray()
                .map((coord: any) => {
                  return {
                    lat: coord.lat(),
                    lng: coord.lng(),
                  };
                });
              setCoords(coords);
              setCircle(null);
            }
          );
        }
      }
    );

    if (document) {
      const draw: any = document.getElementById("draw");
      const circle: any = document.getElementById("circle");
      const clearall: any = document.getElementById("clearall");
      const apply: any = document.getElementById("apply");
      const clearToggle = () => {
        setToggleDraw(false);
        setToggleCircle(false);
      };
      if (apply) {
        apply.onclick = () => {
          drawingManager.setDrawingMode(null);
          clearToggle();
        };
      }
      if (draw) {
        draw.onclick = () => {
          drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
          );
          clearToggle();
          setToggleDraw(true);
        };
      }
      if (circle) {
        circle.onclick = () => {
          drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
          clearToggle();
          setToggleCircle(true);
        };
      }
      if (clearall) {
        clearall.onclick = () => {
          drawingManager.setDrawingMode(null);
          clearToggle();
          if (lastOverlay) {
            lastOverlay.setMap(null);
          }
          setCircle(null);
          setCoords(null);
        };
      }
    }
  };

  useEffect(() => {
    initMap();
  }, []);
  return <div id="map" css={{ height: "70vh" }}></div>;
};

const GeoFenceBranchIdSelector = ({
  branch_id,
  setBranchId,
}: {
  branch_id: string;
  setBranchId: (b: string) => void;
}) => {
  const {
    result_branches,
    loading_branches,
    error_branches,
  } = useListBranches();
  useEffect(() => {
    if (!branch_id && !loading_branches) {
      let initialBranch = result_branches.find(
        ({ id }) => localStorage.getItem("geofence:selectedBranchedId") === id
      );
      if (initialBranch) {
        setBranchId(initialBranch.id);
      } else if (!initialBranch && result_branches[0]) {
        setBranchId(result_branches[0].id);
      }
    }
  }, [loading_branches]);
  useEffect(() => {
    if (branch_id) {
      localStorage.setItem("geofence:selectedBranchedId", branch_id);
    }
  }, [branch_id]);
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
        value={branch_id}
        onChange={(e: any) => {
          setBranchId(e.target.value);
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
