import { Geofence, GeofenceCreateInput } from "../../../types/geofence";
import { useCallAPI } from "../../useCallAPI";

export const useCreateGeofence = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Geofence;
  }>(
    {
      url: `/api/v1/geofence`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  return {
    loading_geofence_create: loading,
    fire_geofence_create: (geofenceInput: GeofenceCreateInput) => {
      // return new Promise((resolve, reject) => {
      //     .then(({ data: { data, code, message } }) => {
      //       if (code === 0) {
      //         reject(message);
      //       } else {
      //         resolve(data);
      //       }
      //     })
      //     .catch((ex) => {
      //       reject(ex.toString());
      //     });
      // });


      return  fire({
        data: {
          ...geofenceInput,
          coordinates: JSON.stringify(geofenceInput.coordinates || []),
        },
      })
    },
  };
};
