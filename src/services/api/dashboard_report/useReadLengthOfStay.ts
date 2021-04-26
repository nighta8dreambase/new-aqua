import { error } from "console";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { GeneralReport } from "../../../types/overviewReport";
import { useCallAPI } from "../../useCallAPI";
import { useListUser } from "../user/useListUser";
import { callReadUser } from "../user/useReadUser";
import { User } from "../../../types/user";
import { dateStr } from "../../../utils";
import { DateTime } from "luxon";

export const useReadLengthOfStay = (endDate?: Date, startDate?: Date) => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data?: {
      group_length_of_stay: {
        name_en: string;
        name_th: string;
        length_of_stay: number;
      }[];
    };
  }>({
    url: `/api/v1/dashboard/group-quarantines`,
    method: "GET",
  });

  return {
    result_length_of_stay: (res?.data?.group_length_of_stay || []).map(
      ({ name_en, length_of_stay }) => {
        return {
          y: length_of_stay,
          x: name_en,
        };
      }
    ),
    loading_length_of_stay: loading,
    error_length_of_stay: error,
  };
};
