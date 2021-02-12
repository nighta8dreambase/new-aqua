import { TempHistoryReport } from "../../../types/personalReport";
import { Geofence, GeofenceUpdateInput } from "../../../types/geofence";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useUpdateGeofence = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Geofence;
  }>(
    {
      url: `api/v1/geofence/`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  return {
    result_geofence_update: res?.data,
    loading_geofence_update: loading,
    error_geofence_update: error,
    fire_geofence_update: (geofenceInput: GeofenceUpdateInput) => {
      return fire({
        url: `api/v1/geofence/` + geofenceInput.id,
        data: {
          ...geofenceInput,
          coordinates: JSON.stringify(geofenceInput.coordinates || []),
        },
        method: "PUT",
      });
    },
  };
};
