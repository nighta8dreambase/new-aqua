import { observer } from "mobx-react-lite";
import { webStore } from "../../../stores/webStore";
import { Filter, User, UserFromAPI } from "../../../types/user";
import { userDevice } from "../../../types/device";
import { useCallAPI } from "../../useCallAPI";
import { processServerUser } from "./useReadUser";
import { Places } from "../../../types/places";
// import { MOCKUP_USER } from "./useReadUser";

export const useListAllUser = (filter?: Filter) => {
  // console.log("useListAllUser filter", filter);
  // const MOCKUP_USERS: User[] = Array.from(Array(10).keys()).map((v, index) => {
  //   return {
  //     ...MOCKUP_USER,
  //     id: index.toString(),
  //     latest_lat: 10 + index / 10,
  //     latest_lng: 10 + index / 10,
  //   };
  // });

  // return {
  //   result_userList: MOCKUP_USERS,
  //   loading_userList: false,
  //   error_userList: false,
  // };
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data?: {
      total?: number;
      user_quarantines?: {
        id: string;
        device?: userDevice;
        place?: Places;
        length_of_stay: number;
        user: User;
      }[];
    };
  }>({
    url: `/api/v1/dashboard/users`,
    method: "GET",
    // data: {
    //   filter: filter,
    // },
    params: {
      page: filter?.page || 1,
      perPage: filter?.perPage || 10,
      body_temp: filter?.filter_temp,
      battery: filter?.filter_battery,
      device_wearing: filter?.filter_wear,
      place: filter?.filter_yacht_name,
      keyword: filter?.filter_Keyword,
    },
  });

  // console.log("useListAllUser", res?.data);

  return {
    result_userList: res?.data?.user_quarantines || [],
    total: res?.data?.total || 0,
    loading_userList: loading,
    error_userList: error,
  };
};
