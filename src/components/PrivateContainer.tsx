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
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingsIcon from "@material-ui/icons/Settings";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import {
  makeStyles,
  Theme,
  createStyles,
  Avatar,
  Button,
  Badge,
  Box,
  MenuList,
  ListItemIcon,
  SwipeableDrawer,
  Popover,
  Grid,
  Divider,
  Select,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { useLogout } from "../services/api/auth/useLogout";
import { useSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import {
  Notification,
  NotificationMobile,
} from "../features/Notification/Notification";
import { useListSOSUser } from "../services/api/user/useListSOSUser";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      padding: 6,
    },
    menuIcon: {
      minWidth: "unset",
      marginRight: 10,
    },
    menuItem: {
      borderBottom: "4px solid transparent",
      padding: "18px 0 18px 0",
      margin: "0 16px",
      "&:hover": {
        borderBottom: "4px solid var(--primary)",
        color: "var(--primary)",

        backgroundColor: "transparent",
      },
      "&:hover svg": {
        fill: "var(--primary)",
      },
    },
    menuItemActive: {
      borderBottom: "4px solid var(--primary)",
      color: "var(--primary)",
      fontWeight: "bold",
      padding: "18px 0 18px 0",
      margin: "0 16px",
      "& svg": {
        fill: "var(--primary)",
      },
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    leftMenu: {
      width: 250,
      flexGrow: 1,
      paddingLeft: "1rem",
      display: "flex",
      alignItems: "center",
      "@media (max-width: 992px)": {
        display: "block",
      },
    },
    logo: {
      height: "1.2rem",
      padding: "0 0.5rem",
    },
    avatar: {
      width: 30,
      height: 30,
    },
  })
);

const ListMenu = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { result_userListSOS_raw, loading_userListSOS } = useListSOSUser();
  return (
    <>
      {webStore.device === "mobile" && (
        <div style={{ marginBottom: "2rem" }}>
          <ProfileSelector />
        </div>
      )}
      <MenuItem
        onClick={() => {
          history.push("/");
        }}
        className={
          location.pathname === "/" ? classes.menuItemActive : classes.menuItem
        }
      >
        <Box px={2} display="flex" alignItems="center">
          <ListItemIcon className={classes.menuIcon}>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </Box>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push("/user/list");
        }}
        className={
          location.pathname.indexOf("/user") >= 0
            ? classes.menuItemActive
            : classes.menuItem
        }
      >
        <Box px={2} display="flex" alignItems="center">
          <ListItemIcon className={classes.menuIcon}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          User list
        </Box>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push("/alert");
        }}
        className={
          location.pathname.indexOf("/alert") >= 0
            ? classes.menuItemActive
            : classes.menuItem
        }
        css={{ paddingRight: 16 }}
      >
        <Box px={2} display="flex" alignItems="center">
          <ListItemIcon className={classes.menuIcon}>
            <ReportProblemIcon fontSize="small" />
          </ListItemIcon>
          Alert
          <Box mx={1.3} />
          {result_userListSOS_raw.length > 0 && (
            <Badge
              badgeContent={result_userListSOS_raw.length}
              max={9}
              color="secondary"
            />
          )}
        </Box>
      </MenuItem>
    </>
  );
};

export const ProfileSelector = observer(() => {
  const history = useHistory();
  // const width = "";
  // console.log(webStore.device)
  return (
    <Select
      labelId="user-selection"
      id="user-selection"
      style={{
        marginLeft: "1rem",
        minWidth: "10rem",
        display: webStore.selectedProject ? "" : "none",
      }}
      value={webStore.selectedProject?.id || ""}
      variant="outlined"
      onChange={(e) => {
        if (!webStore.profile) {
          return;
        }
        webStore.setSelectedProject(
          (webStore.profile.project || []).filter(
            ({ id }) => id === e.target.value
          )[0]
        );
        history.push("/");
      }}
    >
      {(webStore.profile?.project || []).map((project) => {
        const { id, name_th } = project;
        console.warn("loop project", webStore.selectedProject?.id, id);
        return <MenuItem value={id}>{name_th}</MenuItem>;
      })}
    </Select>
  );
});

export const PrivateContainer = observer(({ children, title }: any) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { fire_logout } = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorLeftMenu, setAnchorLeftMenu] = useState<boolean>(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null);
  const openNoti = Boolean(anchorNoti);
  const handleNotiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNoti(event.currentTarget);
  };
  const handleNotiClose = () => {
    setAnchorNoti(null);
  };
  const [notiCount, setNotiCount] = useState(0);
  const location = useLocation();

  // console.log("token", localStorage.getItem("token"));

  return (
    <div>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          <Box display={{ xs: "block", md: "none" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setAnchorLeftMenu(true);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <SwipeableDrawer
            // anchor={anchor}
            open={anchorLeftMenu}
            onClose={() => {
              setAnchorLeftMenu(false);
            }}
            onOpen={() => {
              setAnchorLeftMenu(true);
            }}
          >
            <Box className={classes.leftMenu} py={4} px={1}>
              <ListMenu />
            </Box>
          </SwipeableDrawer>
          {webStore.profile && webStore.profile.logo && (
            <img
              onClick={() => history.push("/")}
              className={classes.logo}
              src={webStore.profile.logo}
            />
          )}
          {webStore.device !== "mobile" && <ProfileSelector />}

          {webStore.profile && (
            <>
              <Box
                textAlign="center"
                className={classes.root}
                display={{ xs: "none", md: "flex" }}
                justifyContent="center"
              >
                <ListMenu />
              </Box>
              <Box
                className={classes.root}
                display={{ xs: "block", md: "none" }}
              ></Box>
              <Box display={{ xs: "none", md: "block" }}>
                {/* <MenuItem className={classes.menuButton}>
                  <IconButton
                    onClick={() => {
                      history.push("/setting");
                    }}
                    size="small"
                  >
                    <SettingsIcon />
                  </IconButton>
                </MenuItem> */}
              </Box>
              <MenuItem className={classes.menuButton}>
                  <IconButton
                    onClick={() => {
                      history.push("/setting");
                    }}
                    size="small"
                  >
                    <SettingsIcon />
                  </IconButton>
                </MenuItem>
              <MenuItem
                className={classes.menuButton}
                onClick={(e) => {
                  location.pathname === "/notification"
                    ? console.log("clicked")
                    : webStore.device === "mobile"
                    ? history.push("/notification")
                    : handleNotiClick(e);
                }}
                css={{
                  borderBottom:
                    location.pathname === "/notification"
                      ? "4px solid var(--primary)"
                      : "",
                }}
              >
                <IconButton
                  aria-label="show 11 new notifications"
                  color="inherit"
                  size="small"
                >
                  {location.pathname === "/notification" ? (
                    <NotificationsIcon css={{ color: "var(--primary)" }} />
                  ) : (
                    <Badge
                      color="secondary"
                      badgeContent=" "
                      variant="dot"
                      overlap="circle"
                    >
                      <NotificationsIcon />
                    </Badge>
                  )}
                </IconButton>
              </MenuItem>
              <MenuItem className={classes.menuButton}>
                <IconButton onClick={handleMenu} size="small">
                  <Avatar
                    alt={webStore.profile.name}
                    src={webStore.profile.avatar}
                    className={classes.avatar}
                  />
                </IconButton>
              </MenuItem>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  style={{ minWidth: "10rem" }}
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  style={{ minWidth: "10rem" }}
                  onClick={() => {
                    fire_logout().then(() => {
                      enqueueSnackbar("ออกจากระบบ", {
                        key: "logoutSuccess",
                        variant: "success",
                        autoHideDuration: 3000,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                      });
                    });
                    handleClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
              <Popover
                id="menu-noti"
                open={openNoti}
                anchorEl={anchorNoti}
                onClose={handleNotiClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  fontSize={14}
                  fontWeight={600}
                  px={3}
                  py={2}
                  css={{ width: "100%" }}
                >
                  <Box>Notification ({notiCount})</Box>
                  <Box
                    color="var(--primary)"
                    css={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      history.push("/notification");
                      handleNotiClose();
                    }}
                  >
                    VIEW ALL
                  </Box>
                </Box>
                <Divider />
                <Notification
                  popup={true}
                  handleNotiClose={handleNotiClose}
                  setNotiCount={setNotiCount}
                />
              </Popover>
            </>
          )}
        </Toolbar>
      </AppBar>
      <div style={{ paddingTop: "4rem" }}>{children}</div>
    </div>
  );
});
