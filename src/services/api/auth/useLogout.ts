import { useHistory } from "react-router-dom";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useLogout = () => {
  const history = useHistory();

  const [{ data, loading, error }, fire] = useCallAPI<{ status: number }>(
    {
      url: `/auth/logout`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_logout: data?.status,
    loading_logout: loading,
    error_logout: error,
    fire_logout: () => {
      return resolveMockup({ data: { status: 1 } }).then(() => {
        localStorage.clear();
        history.push("/");
      });
      return fire().then(() => {
        localStorage.clear();
        history.push("/");
      });
    },
  };
};
