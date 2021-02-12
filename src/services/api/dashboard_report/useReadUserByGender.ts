import { UserByGenderReport } from "../../../types/overviewReport";
import { useCallAPI } from "../../useCallAPI";

export const useReadUserByGender = (endDate?: Date, startDate?: Date) => {
  // const MOCKUP_REPORT: UserByGenderReport = {
  //   total: 130,
  //   total_female: 100,
  //   total_male: 30,
  // };
  // return {
  //   result_user_by_gender: MOCKUP_REPORT,
  //   loading_user_by_gender: false,
  //   error_user_by_gender: false,
  // };
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      gender: UserByGenderReport;
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
    result_user_by_gender: res?.data?.gender,
    loading_user_by_gender: loading,
    error_user_by_gender: error,
  };
};
