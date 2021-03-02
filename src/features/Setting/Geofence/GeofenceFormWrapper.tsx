import { Container, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import { useCreateGeofence } from "../../../services/api/geofence/useCreateGeofence";
import { useDeleteGeofence } from "../../../services/api/geofence/useDeleteGeofence";
import { useListAllGeofence } from "../../../services/api/geofence/useListAllGeofence";
import { useReadPlace } from "../../../services/api/geofence/useReadPlace";
import { useUpdateGeofence } from "../../../services/api/geofence/useUpdateGeofence";
import { usePlace } from "../../../services/api/Options/usePlace";
import { useListAllUser } from "../../../services/api/user/useListAllUser";
import { webStore } from "../../../stores/webStore";
import {
  createStyles,
  Theme,
  Theme as ThemeNative,
} from "@material-ui/core/styles";
import {
  GeofenceCreateInput,
  GeofenceUpdateInput,
} from "../../../types/geofence";
import { Places } from "../../../types/places";
import { User } from "../../../types/user";
import { Geofence } from "./Geofence";
export enum GEOFENCE_PAGE_MODE {
  LIST = "LIST",
  add = "add",
  edit = "edit",
}
export type GEOFENCE_PAGE_MODE_STR = keyof typeof GEOFENCE_PAGE_MODE;
const useStyles2 = makeStyles((ThemeNative: ThemeNative) =>
  createStyles({
    formControl: {
      // margin: ThemeNative.spacing(1),
    },
    selectEmpty: {
      marginTop: ThemeNative.spacing(2),
    },
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content",
    },
    formControl2: {
      marginTop: ThemeNative.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: ThemeNative.spacing(1),
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: ThemeNative.palette.background.paper,
      border: "2px solid #000",
      boxShadow: ThemeNative.shadows[5],
      padding: ThemeNative.spacing(2, 4, 3),
      minWidth: "80%",
      minHeight: "80%",
    },
    // datagrid: {
    //   zIndex:1
    // },
  })
);

const useGeofenceState = ({ mode }: { mode: GEOFENCE_PAGE_MODE_STR }) => {
  const {
    result_geofenceList,
    loading_geofenceList,
    fire_geofenceList,
  } = useListAllGeofence();

  const [geofenceForm, setGeofenceFormData] = useState<
    | {
        geofence: GeofenceCreateInput | GeofenceUpdateInput;
        places: {
          name_en: string;
          id: string;
          name_th: string;
          created_at: string;
        }[];
        users: Partial<User>[];
        distype: "m" | "km";
      }
    | undefined
  >();
  // console.log("geofenceForm", geofenceForm);

  const { result_userList, loading_userList, total } = useListAllUser({
    startDate: webStore.startDate || new Date(),
    endDate: webStore.endDate || new Date(),
    filter_temp: "",
    filter_wear: "",
    filter_battery: "",
    filter_yacht_name: "",
    filter_Keyword: "",
    page: 1,
    perPage: 100,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [geofenceId, setCurrentGeofenceId] = useState<string | undefined>(
    undefined
  );
  const { fire_geofence_delete, loading_geofence_delete } = useDeleteGeofence();
  const [branchId, setCurrentBranchId] = useState<string | undefined>(
    undefined
  );
  const { enqueueSnackbar } = useSnackbar();
  const refreshForm = () => {
    if (geofenceForm) setGeofenceFormData({ ...geofenceForm });
  };
  const uiStyle = useStyles2();
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
  const setFormInitialData = () => {
    setGeofenceFormData({
      geofence: {
        name: "",

        coordinates: [],
        branch_id: branchId || "",
      },
      places: [],
      users: [],
      distype: "m",
    });
  };

  const classes = useStyles();
  return {
    classes,
    result_userList,
    loading_userList,
    total,
    mode,
    uiStyle,
    result_geofenceList,
    loading_geofenceList,
    setFormInitialData,
    fire_geofenceList,
    geofenceForm,
    setGeofenceFormData,
    isDrawing,
    setIsDrawing,
    geofenceId,
    setCurrentGeofenceId,
    branchId,
    setCurrentBranchId,
    fire_geofence_delete,
    loading_geofence_delete,
    enqueueSnackbar,
    refreshForm,
  };
};
type GeofenceState = ReturnType<typeof useGeofenceState>;
const GeofenceContext = React.createContext<GeofenceState | undefined>(
  undefined
);
export const useGeofenceContext = () => {
  const ctx = React.useContext(GeofenceContext);
  if (!ctx) {
    throw new Error("Must Wrap inside wrapper");
  }
  return ctx;
};
export const GeofenceWrapper = ({
  children,
  mode,
}: {
  mode: GEOFENCE_PAGE_MODE;
  children: ReactElement;
}) => {
  return (
    <Container maxWidth="lg" className="py-4">
      <GeofenceContext.Provider value={useGeofenceState({ mode })}>
        {children}
      </GeofenceContext.Provider>
    </Container>
  );
};
