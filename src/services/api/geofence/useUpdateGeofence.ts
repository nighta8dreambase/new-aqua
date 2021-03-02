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
    fire_geofence_insert_all_user: (geofence_id: string,places_id:any) => {
      return fire({
        method: "POST",
        url: `api/v1/geofence/${geofence_id}/control-area/users/all`,
        data:{
            places:JSON.stringify(places_id)
        }
,

      });

    },
    fire_geofence_insert_custom_user: (geofence_id: string,user_id:any) => {
      return fire({
        url: `api/v1/geofence/${geofence_id}/control-area/users`,
        method: "POST",
        data:{
          users:JSON.stringify(user_id)
      }
      });
    },
  };
};
