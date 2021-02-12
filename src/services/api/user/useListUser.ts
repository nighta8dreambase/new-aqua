import { observer } from "mobx-react-lite";
import { webStore } from "../../../stores/webStore";
import {
  Filter,
  User,
  UserFromAPI,
  UsersQuarantine,
} from "../../../types/user";
import { userDevice } from "../../../types/device";
import { useCallAPI } from "../../useCallAPI";
import { processServerUser } from "./useReadUser";
// import { MOCKUP_USER } from "./useReadUser";

export const useListUser = (filter?: Filter) => {
  console.log("filter", filter);
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
      user_quarantines?: UsersQuarantine[];
    };
  }>({
    url: `/api/v1/dashboard/group-quarantines`,
    method: "GET",
    // data: {
    //   filter: filter,
    // },
    params: {
      page: filter?.page || 1,
      perPage: filter?.perPage || 10,
    },
  });

  return {
    result_userList: res?.data?.user_quarantines || [],
    total: res?.data?.total || 0,
    loading_userList: loading,
    error_userList: error,
  };
};
