import { useCallAPI } from "../../useCallAPI";

export const useChangePassword = () => {
  const [{ data, loading, error }, fire] = useCallAPI<{
    data?: { code: number; message: string };
  }>(
    {
      url: `api/v1/users/change-password/confirm`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_changepassword: data?.data?.code,
    result_changepassword_message: data?.data?.message,
    loading_changepassword: loading,
    error_changepassword: error,
    fire_changepassword: (secret_code: string, password: string) => {
      return fire({
        data: {
          secret_code,
          password,
        },
      });
    },
  };
};
