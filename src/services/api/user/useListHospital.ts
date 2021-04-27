import { TempHistoryReport } from "../../../types/personalReport";
import { Hospital } from "../../../types/hospital";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useListHospital = (branch_id: string) => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: Hospital[];
  }>({
    url: `/api/v1/hospitals/branches/${branch_id}`,
    method: "GET",
    data: {
      branch_id,
    },
  });
  return {
    result_hospital: res?.data || [],
    loading_hospital: loading,
    error_hospital: error,
  };
};
