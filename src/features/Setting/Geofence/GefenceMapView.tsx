import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useGeofenceContext } from "./GeofenceFormWrapper";
import _ from "lodash";

const GeofenceMapViewInner = (data: any) => {
  const g = useGeofenceContext();
  const [googleMap, setGooglaMap] = useState<any | undefined>();
  const activeGeofence = g.geofenceForm?.geofence;
  const users = g.result_userList;
  const geofences = _.uniqBy(
    activeGeofence
      ? [...g.result_geofenceList, activeGeofence]
      : [...g.result_geofenceList],
    "id"
  ).filter((g) => (g.coordinates || []).length > 0);
  // console.log("geofences", geofences);
  const setToggleDraw = g.setIsDrawing;
  const ref = useRef<{
    g: ReturnType<typeof useGeofenceContext>;
    activeGeofence: typeof activeGeofence;
  }>();
  useEffect(() => {
    ref.current = {
      g: g,
      activeGeofence: activeGeofence,
    };
  }, [g.geofenceForm, activeGeofence]);
  const setCoords = (p: { lat: number; lng: number }[]) => {
    if (!ref.current) {
      return;
    }
    console.log("setCoords", p);
    if (ref.current.activeGeofence) {
      ref.current.activeGeofence.coordinates = p;
      ref.current.activeGeofence.radius = undefined;
      if (ref.current.g.geofenceForm) {
        ref.current.g.setGeofenceFormData({ ...ref.current.g.geofenceForm });
      }
    }
  };
  const setCircle = (p: { radius: number; lat: number; lng: number }) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.activeGeofence) {
      ref.current.activeGeofence.coordinates = [{ lat: p.lat, lng: p.lng }];
      ref.current.activeGeofence.radius = p.radius;
      if (ref.current.g.geofenceForm) {
        ref.current.g.setGeofenceFormData({ ...ref.current.g.geofenceForm });
      }
    }
  };
  const clearDrawing = () => {
    if (!ref.current) {
      return;
    }
    if (ref.current.activeGeofence) {
      ref.current.activeGeofence.coordinates = [];
      ref.current.activeGeofence.radius = undefined;
      if (ref.current.g.geofenceForm) {
        ref.current.g.setGeofenceFormData({ ...ref.current.g.geofenceForm });
      }
    }
  };

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
    geofences.map((d, i: any) => {
      const isActive =
        activeGeofence && activeGeofence.id && d.id === activeGeofence.id;
      const fenceCards: any = document.getElementsByClassName("fencecard");
      // console.log(fenceCards)
      const fenceCard = fenceCards[dump_count++];

      // console.log(fenceCards)
      if (d.radius) {
        const circle = new google.maps.Circle({
          fillColor: isActive ? "rgba(70,132,226,0.3)" : "#96989A",
          fillOpacity: isActive ? 1 : 0.1,
          strokeWeight: 2,
          strokeColor: isActive ? "#4684E2" : "#43444B",
          strokeOpacity: isActive ? 1 : 0.2,
          center: {
            lat: (d.coordinates || [])[0].lat,
            lng: (d.coordinates || [])[0].lng,
          },
          radius: d.radius,
          editable: isActive ? true : false,
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
        if (isActive) {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
        }
        google.maps.event.addListener(circle, "radius_changed", function () {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
        });
        google.maps.event.addListener(circle, "center_changed", function () {
          setCircle({
            radius: circle.getRadius(),
            lat: circle.getCenter().lat(),
            lng: circle.getCenter().lng(),
          });
        });
      } else {
        const shape = new google.maps.Polygon({
          paths: d.coordinates,
          fillColor: isActive ? "rgba(70,132,226,0.3)" : "#96989A",
          fillOpacity: isActive ? 1 : 0.1,
          strokeWeight: 2,
          strokeColor: isActive ? "#4684E2" : "#43444B",
          strokeOpacity: isActive ? 1 : 0.2,
          editable: isActive ? true : false,
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
        if (isActive) {
          setCoords(coords);
        }
      }
    });

    // CenterLat,CenterLong

    map.setCenter({ lat: centerLat, lng: centerLng }); //จุดศูนย์กลาง map
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

          google.maps.event.addListener(circle, "radius_changed", function () {
            setCircle({
              radius: circle.getRadius(),
              lat: circle.getCenter().lat(),
              lng: circle.getCenter().lng(),
            });
          });
          google.maps.event.addListener(circle, "center_changed", function () {
            setCircle({
              radius: circle.getRadius(),
              lat: circle.getCenter().lat(),
              lng: circle.getCenter().lng(),
            });
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
          setToggleDraw(true);
        };
      }
      if (clearall) {
        clearall.onclick = () => {
          drawingManager.setDrawingMode(null);
          clearToggle();
          if (lastOverlay) {
            lastOverlay.setMap(null);
          }
          clearDrawing();
        };
      }
    }

    setGooglaMap(map);
  };

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (typeof googleMap !== "undefined") {
      googleMap.setCenter({ lat: data.data.lat, lng: data.data.long }); //จุดศูนย์กลาง map
    }
  }, [data.data.lat, data.data.long, googleMap]);

  return <div id="map" css={{ height: "70vh" }}></div>;
};

export const GeofenceMapView = (data: any) => {
  console.log(data);
  const lat = data.data.lat;
  const long = data.data.long;

  const g = useGeofenceContext();

  return (
    <GeofenceMapViewInner
      data={{ lat: lat, long: long }}
      key={(g.result_geofenceList || []).map((g) => g.id).join("")}
    />
  );
};
