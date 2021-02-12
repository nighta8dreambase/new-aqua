import { observer } from "mobx-react-lite";
import { webStore } from "../../../stores/webStore";
import { Filter, User, UserFromAPI } from "../../../types/user";
import { userDevice } from "../../../types/device";
import { useCallAPI } from "../../useCallAPI";

export const useApproveSOS = (id: string) => {
  const [{ data, loading, error }, fire] = useCallAPI<{ status: number }>(
    {
      url: `/api/v1/dashboard/sos`,
      method: "POST",
      data: {
        id,
      },
    },
    { manual: true }
  );

  return {
    result_userSOS: data?.status,
    loading_userSOS: loading,
    error_userSOS: error,
    fire_approveSOS: () => {},
  };
};
