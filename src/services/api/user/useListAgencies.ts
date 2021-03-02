import { TempHistoryReport } from "../../../types/personalReport";
import { Agencies } from "../../../types/agencies";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useListAgencies = (branch_id: string) => {


      const [{ data: res, loading, error }, fire] = useCallAPI<{
        data: Agencies[];
      }>
    ({
      url: `/api/v1/agencies/branches/${branch_id}`,
      method: "GET",
      data: {
        branch_id,
      },
    });
    return {
      result_agencies: res?.data || [],
      loading_agencies: loading,
      error_agencies: error,
    };
    

};
