import { UserByNationalityReport } from "../../../types/overviewReport";
import { useCallAPI } from "../../useCallAPI";

export const useReadUserByNationality = (endDate?: Date, startDate?: Date) => {
  // const MOCKUP_REPORT: UserByNationalityReport = [
  //   {
  //     name: "thailand",
  //     total: 200,
  //   },
  //   {
  //     name: "england",
  //     total: 200,
  //   },
  // ];
  // return {
  //   result_user_by_nation: MOCKUP_REPORT,
  //   loading_user_by_nation: false,
  //   error_user_by_nation: false,
  // };
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      nationality: UserByNationalityReport;
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
    result_user_by_nation: res?.data?.nationality,
    loading_user_by_nation: loading,
    error_user_by_nation: error,
    fire_user_by_nation: (endDate?: Date, startDate?: Date) => {
      return fire({
        data: {
          startDate,
          endDate,
        },
      });
    },
  };
};
