import { TempHistoryReport } from "../../../types/personalReport";
import { Geofence, GeofenceDeleteInput } from "../../../types/geofence";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useDeleteGeofence = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Geofence;
  }>(
    {
      url: `/api/v1/geofence`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );
  return {
    result_geofence_delete: res?.data,
    loading_geofence_delete: loading,
    error_geofence_delete: error,
    fire_geofence_delete: (geofence: GeofenceDeleteInput) => {
      return fire({
        url: `/api/v1/geofence/${geofence.id}`,
        method: "DELETE",
        data: geofence,
      });
    },
  };
};
