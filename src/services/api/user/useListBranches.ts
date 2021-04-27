import { TempHistoryReport } from "../../../types/personalReport";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useListBranches = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: { id: string; name_en: string; name_th: string }[];
  }>({
    url: `/api/v1/branches`,
    method: "GET",
  });
  return {
    result_branches: res?.data || [],
    loading_branches: loading,
    error_branches: error,
  };
};
