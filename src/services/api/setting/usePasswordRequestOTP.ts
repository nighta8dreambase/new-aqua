import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const usePasswordRequestOTP = () => {
  const [{ data, loading, error }, fire] = useCallAPI<{
    data?: { phone_number: string; ref_code: string };
  }>(
    {
      url: `/api/v1/users/change-password`,
      method: "POST",
    },
    { manual: true }
  );

  return {
    result_request_otp: data?.data?.phone_number,
    result_request_otp_ref: data?.data?.ref_code,
    loading_request_otp: loading,
    error_request_otp: error,
    fire_request_otp: (phone_number: string) => {
      return fire({
        data: {
          phone_number,
        },
      });
    },
  };
};
