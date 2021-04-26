import { css, jsx } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { observer } from "mobx-react-lite";

import { ReactComponent as Pin } from "./assets/pin.svg";
import { ReactComponent as UserPin } from "./assets/user-pin.svg";
import { Box, makeStyles, Popover } from "@material-ui/core";

function deviceIconStyles() {
  return {
    successIcon: {
      color: "green",
    },
    errorIcon: {
      color: "red",
    },
  };
}

export const WPopover = ({
  open,
  anchorEl,
  hoverText,
}: {
  open: boolean;
  anchorEl: any;
  hoverText?: string;
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      style={{ pointerEvents: "none" }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <div
        style={{ padding: "0.2em", backgroundColor: "black", color: "white" }}
      >
        {hoverText}
      </div>
    </Popover>
  );
};

const Marker = observer(
  ({
    lat,
    lng,
    name,
    active,
    hoverText,
    onClick,
    hilight,
    dot,
  }: {
    lat: number;
    lng: number;
    active: boolean;
    hilight?: boolean;
    name: string;
    hoverText?: string;
    dot: boolean;
    onClick?: () => void;
  }) => {
    const classes = makeStyles(deviceIconStyles)();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    return (
      <div
        style={{
          position: "absolute",
          cursor: "pointer",
          transition: "all 0.5s",
        }}
      >
        <div
          style={{
            position: "relative",
            opacity: 1,
            transformOrigin: "50% 100%",
            transition: "all 0.25s",
            zIndex: hilight ? 99 : 1,
            transform: `translate(-50%, -50%) scale(${hilight ? 1.5 : 1})`,
          }}
          css={css`
            .pin path {
              fill: ${active ? (hilight ? "#5ad01b" : "green") : "red"};
            }
          `}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={onClick}
        >
          {dot ? (
            <UserPin style={{ width: "1.5rem", height: "auto" }} />
          ) : (
            <>
              <Pin
                style={{ width: "2rem", height: "auto" }}
                className={`pin ${
                  active ? classes.successIcon : classes.errorIcon
                }`}
                fontSize="large"
              />
              <div
                style={{
                  position: "absolute",
                  lineHeight: "2rem",
                  color: "white",
                }}
                className="w-full text-center top-0 left-0 font-bold"
              >
                {name}
              </div>
            </>
          )}
        </div>
        <WPopover
          {...{
            open: hoverText ? open : false,
            anchorEl: anchorEl,
            hoverText: hoverText,
          }}
        />
      </div>
    );
  }
);

export const Map = observer(
  ({
    locations,
    mapRef,
  }: {
    locations: {
      lat: number;
      lng: number;
      active: boolean;
      name: string;
      hoverText?: string;
      dot?: boolean;
      onClick?: () => void;
    }[];
    mapRef?: any;
  }) => {
    let lat = 0,
      lng = 0;

    const [center, setCenter] = useState<any>();
    const [zoom, setZoom] = useState<any>();
    const [focusName, setFocusName] = useState<string>();
    if (locations.length > 0) {
      for (const l of locations) {
        lat += l.lat;
        lng += l.lng;
      }
      lat /= locations.length;
      lng /= locations.length;
    }
    useEffect(() => {
      if (mapRef) {
        mapRef.current = {
          focus: (lat: number, lng: number, name: string) => {
            const valid =
              !isNaN(lat) &&
              !isNaN(lng) &&
              lat > 0 &&
              lng > 0 &&
              Math.abs(lat) <= 90 &&
              Math.abs(lng) <= 180;
            if (valid) {
              setCenter({ lat, lng });
              setZoom(13);
              setFocusName(name);
            }
          },
          reset: () => {
            console.log("reset");
            setCenter(undefined);
            setZoom(undefined);
            setFocusName(undefined);
          },
        };
      }
    }, []);
    // console.log(center, zoom);

    return (
      // Important! Always set the container height explicitly
      <div className="w-full h-full top-0 left-0 absolute">
        {locations.length > 0 ? (
          <GoogleMapReact
            key={zoom || "default"}
            options={{
              disableDoubleClickZoom: true,
            }}
            bootstrapURLKeys={{
              key: "AIzaSyAfhKE9MOf0H3VwfJJAgS_gjS9oPdkHfZQ",
            }}
            center={center || { lat: lat, lng: lng }}
            zoom={zoom || 9}
          >
            {locations.map((location) => {
              return (
                <Marker
                  {...{
                    hilight:
                      center &&
                      center.lat === location.lat &&
                      center.lng === location.lng &&
                      focusName === location.name,
                    lat: location.lat,
                    lng: location.lng,
                    name: location.name,
                    active: location.active,
                    hoverText: location.hoverText,
                    onClick: location.onClick,
                    dot: location.dot ? location.dot : false,
                  }}
                />
              );
            })}
          </GoogleMapReact>
        ) : (
          <div
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              position: "absolute",
              opacity: "0.5",
            }}
          >
            Map Info : All locations are unknown
          </div>
        )}
      </div>
    );
  }
);
