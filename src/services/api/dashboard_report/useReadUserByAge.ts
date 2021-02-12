import { UserByAgeReport } from "../../../types/overviewReport";
import { useCallAPI } from "../../useCallAPI";

export const useReadUserByAge = (endDate?: Date, startDate?: Date) => {
  // const MOCKUP_REPORT: UserByAgeReport = [
  //   {
  //     age: "12-13",
  //     total: 12,
  //   },
  //   {
  //     age: "11",
  //     total: 13,
  //   },
  //   {
  //     age: "13-19",
  //     total: 24,
  //   },
  // ];
  // return {
  //   result_user_by_age: MOCKUP_REPORT,
  //   loading_user_by_age: false,
  //   error_user_by_age: false,
  // };
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      age: UserByAgeReport;
    };
  }>({
    url: `/api/v1/dashboard/personals`,
    method: "GET",
    data: {
      startDate,
      endDate,
    },
  });
  return {
    result_user_by_age: res?.data?.age,
    loading_user_by_age: loading,
    error_user_by_age: error,
  };
};
