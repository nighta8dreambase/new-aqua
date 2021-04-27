import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { observer } from "mobx-react-lite";
import { webStore } from "../stores/webStore";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import {
  makeStyles,
  Theme,
  createStyles,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Grid,
  CardActionArea,
  Paper,
  Container,
} from "@material-ui/core";
import React, { useState } from "react";
import { useLogout } from "../services/api/auth/useLogout";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
export const ProjectWrapper = observer(({ children }: any) => {
  if (!webStore.selectedProject) {
    return (
      <Box m={5}>
        <Container maxWidth="sm">
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="subtitle1">กรุณา เลือก Project</Typography>
            </Grid>
            {(webStore.profile?.project || []).map((project) => {
              const { name_th } = project;
              return (
                <Grid item>
                  <CardActionArea
                    onClick={() => {
                      webStore.setSelectedProject(project);
                    }}
                  >
                    <Paper>
                      <Box p={6} fontSize="large" fontWeight="bold">
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justify="space-between"
                          spacing={3}
                        >
                          <div>{name_th}</div>
                          <ChevronRightIcon />
                        </Grid>
                      </Box>
                    </Paper>
                  </CardActionArea>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
});
