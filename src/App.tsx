import React, { useEffect } from "react";
import { Global, css } from "@emotion/react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import "swiper/swiper-bundle.min.css";
import "./App.css";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./features/Login";
import { SnackbarProvider } from "notistack";
import { AfterLogin } from "./features/AfterLogin";
import { webStore } from "./stores/webStore";
import { observer } from "mobx-react-lite";
//
import { Dashboard, DashboardMobile } from "./features/Dashboard/Dashboard";
import { UserList, UserListMobile } from "./features/UserList/UserList";
import { UserCreate, UserCreateMobile } from "./features/UserManage/UserCreate";
import { UserImport } from "./features/UserManage/UserImport";
import {
  UserPreview,
  UserPreviewMobile,
} from "./features/UserManage/UserPreview";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { LoggingDashboard } from "./features/LoggingDashboard/LoggingDashboard";
import { Notification } from "./features/Notification/Notification";
import { PushData } from "./features/Setting/PushData";
import { CreatePushData } from "./features/Setting/CreatePushData";
import { Geofence } from "./features/Setting/Geofence/Geofence";
import { GeofenceEdit } from "./features/Setting/Geofence/GeofenceEdit";
import { GeofenceCreate } from "./features/Setting/Geofence/GeofenceCreate";
// import { Alert } from "./features/Alert/Alert";
import { Alert, AlertMobile } from "./features/Alert/Alert";
import { Setting } from "./features/Setting/Setting";
import { ChangePassword } from "./features/Setting/ChangePassword";
import { SetNotification } from "./features/Setting/Notification";

const formLabelsTheme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: "#db3131",
        "&$error": {
          color: "#db3131",
        },
      },
    },
  },
});
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
const App = observer(() => {
  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    webStore.setDevice(mobile ? "mobile" : "desktop");
    console.log(webStore.device);
  }, []);
  console.log(webStore.device);
  if (webStore.device === "unknown") {
    return <></>;
  } else if (webStore.device === "desktop") {
  }

  return (
    <MuiThemeProvider theme={formLabelsTheme}>
      <SnackbarProvider>
        <Global
          styles={css`
            .MuiPickersBasePicker-container
              .MuiPickersToolbarButton-toolbarBtn
              .MuiTypography-subtitle1 {
              color: rgba(255, 255, 255, 1) !important;
              text-decoration: underline;
              font-weight: bold;
            }
          `}
        />
        <Router>
          <ScrollToTop />
          <div key={webStore?.profile?.id}>
            <Switch>
              <Route path="/login" component={Login} />
              <PrivateRoute
                path="/"
                title="Dashboard"
                exact
                component={(props: any) => {
                  if (
                    webStore.selectedProject?.is_quarantine === 0 ||
                    window.location.href.indexOf("?log") >= 0
                  ) {
                    return <LoggingDashboard {...props} />;
                  }
                  return webStore.device === "desktop" ? (
                    <Dashboard {...props} />
                  ) : (
                    <DashboardMobile {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/user/list"
                exact
                component={
                  webStore.device === "desktop" ? UserList : UserListMobile
                }
              />
              <PrivateRoute
                path="/user/create"
                exact
                component={
                  webStore.device === "desktop" ? UserCreate : UserCreateMobile
                }
              />
              <PrivateRoute
                path="/user/import"
                exact
                component={webStore.device === "desktop" ? UserImport : null}
              />
              <PrivateRoute
                path="/user/:userId/preview"
                exact
                component={
                  webStore.device === "desktop"
                    ? UserPreview
                    : UserPreviewMobile
                }
              />
              <PrivateRoute
                path="/notification"
                exact
                component={Notification}
              />
              <PrivateRoute path="/setting" exact component={Setting} />
              <PrivateRoute
                path="/setting/pushdata"
                exact
                component={PushData}
              />
              <PrivateRoute
                path="/setting/pushdata/create"
                exact
                component={CreatePushData}
              />
              <PrivateRoute
                path="/setting/geofence"
                exact
                component={Geofence}
              />
              <PrivateRoute
                path="/setting/geofence/add"
                exact
                component={GeofenceCreate}
              />
              <PrivateRoute
                path="/setting/geofence/edit/:id"
                exact
                component={GeofenceEdit}
              />
              <PrivateRoute
                path="/setting/changepassword"
                exact
                component={ChangePassword}
              />
              <PrivateRoute
                path="/setting/notification"
                exact
                component={SetNotification}
              />
              <PrivateRoute path="/alert" exact component={Alert} />
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
});

export default App;
