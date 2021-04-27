import { TempHistoryReport } from "../../../types/personalReport";
import { User, UserUpdateInput } from "../../../types/user";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useUpdateUser = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    user: User;
  }>(
    {
      url: `/user/update`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  return {
    result_userUpdate: res?.user,
    loading_userUpdate: loading,
    error_userUpdate: error,
    fire_userUpdate: (user: User) => {
      return resolveMockup({
        data: {
          ...user,
        },
      } as { data: User });
      return fire({
        data: user,
      });
    },
  };
};
