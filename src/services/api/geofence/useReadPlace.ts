import { Places } from "../../../types/places";
import _ from "lodash";
import { callAPI, useCallAPI } from "../../useCallAPI";

export const useReadPlace = (branch_id: string, manual = false) => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Places[];
  }>(
    {
      url: `/api/v1/branches/${branch_id}/places`,
      method: "GET",
      data: {
        branch_id,
      },
    },
    {
      manual,
    }
  );
  const result_placesRead = res?.data;
  return {
    result_placesRead,
    loading_placesRead: loading,
    error_placesRead: error,
    fire_placesRead: (id: string) => {
      return fire({
        url: `/api/v1/branches/${id}/places`,
        method: "GET",
      });
    },
    fire_alluserPlacesRead: (id: string) => {
      return fire({
        url: `/api/v1/users/places/${id}`,
        method: "GET",
      });
    },
  };
};

//  const GeofenceCreate = observer((props: any) => {
//   return (
//     <GeofenceWrapper mode={GEOFENCE_PAGE_MODE.add}>
//       <GeofenceCreateInner />
//     </GeofenceWrapper>
//   );
// });