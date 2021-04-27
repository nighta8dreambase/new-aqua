import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useForgotPassword = () => {
  const [{ data, loading, error }, fire] = useCallAPI<{ status: number }>(
    {
      url: `/auth/forgot_assword`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_forgot_password: data?.status,
    loading_forgot_password: loading,
    error_forgot_password: error,
    fire_forgot_password: (username: string) => {
      return resolveMockup({ data: { status: 1 } });
      return fire({
        data: {
          username,
        },
      });
    },
  };
};
