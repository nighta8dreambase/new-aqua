import { Geofence } from "../../../types/geofence";
import _ from "lodash";
import { callAPI, useCallAPI } from "../../useCallAPI";

export const useReadGeofence = (geofenceId: string, manual = false) => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Geofence;
  }>(
    {
      url: `/api/v1/geofence/${geofenceId}`,
      method: "GET",
      data: {
        geofenceId,
      },
    },
    {
      manual,
    }
  );
  const result_geofenceRead = res?.data;

  return {
    result_geofenceRead,
    loading_geofenceRead: loading,
    error_geofenceRead: error,
    fire_geofenceRead: fire,
  };
};
