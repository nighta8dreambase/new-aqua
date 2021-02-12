import { Places } from "../../../types/places";
import { useCallAPI } from "../../useCallAPI";

export const usePlace = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data?: Places[];
  }>({
    url: `/api/v1/places`,
    method: "GET",
  });

  return {
    result_places: res?.data || [],
    loading_places: loading,
    error_places: error,
  };
};
