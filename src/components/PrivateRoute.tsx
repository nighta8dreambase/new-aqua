import classes from "*.module.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
} from "@material-ui/core";
import React, { Children, Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { useMe } from "../services/api/auth/useMe";
import { webStore } from "../stores/webStore";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { PrivateContainer } from "./PrivateContainer";
import { AfterLogin } from "../features/AfterLogin";
import { ProjectWrapper } from "./ProjectWrapper";
const ReactWaterMark = require("react-watermark-component");

export const PrivateRoute = ({
  component: Component,
  redirect,
  ...rest
}: any) => {
  const { result_me, loading_me } = useMe();
  // console.log(result_me, loading_me);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (result_me) {
          if (rest.container === false) {
            return (
              <ProjectWrapper>
                <Component {...props} />
              </ProjectWrapper>
            );
          } else if (webStore && webStore.profile) {
            return (
              <PrivateContainer title={rest.title}>
                <div>
                  <ReactWaterMark
                    waterMarkText={webStore.profile.name || "COPYRIGHT"}
                    options={{
                      chunkWidth: 300,
                      chunkHeight: 160,
                      textAlign: "left",
                      textBaseline: "bottom",
                      globalAlpha: 0.04,
                      font: "64px Poppins",
                      rotateAngle: -0.26,
                      fillStyle: "#666",
                    }}
                  >
                    <div style={{ minHeight: "100vh" }}>
                      <ProjectWrapper>
                        <Component {...props} />
                      </ProjectWrapper>
                      <AfterLogin />
                    </div>
                    <Box
                      textAlign="center"
                      py={2}
                      fontSize={10}
                      css={{ backgroundColor: "#fff" }}
                    >
                      Copyright text here
                    </Box>
                  </ReactWaterMark>
                </div>
              </PrivateContainer>
            );
          } else {
            return (
              <>
                <AfterLogin />
              </>
            );
          }
        } else if (!loading_me && !result_me && redirect !== false) {
          console.log("REMOVE TOKEN", localStorage.getItem("token"), result_me);
          localStorage.removeItem("token");
          webStore.setProfile(null);
          return <Redirect to="/login" />;
        } else {
          return <></>;
        }
      }}
    />
  );
};
