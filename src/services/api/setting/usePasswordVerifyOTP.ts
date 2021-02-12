import { useHistory } from "react-router-dom";
import { webStore } from "../../../stores/webStore";
import { Profile } from "../../../types/profile";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const usePasswordVerifyOTP = () => {
  const history = useHistory();
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      secret_code: string;
    };
  }>(
    {
      url: `/api/v1/users/change-password/verify-otp`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_token: res?.data?.secret_code,
    loading_verify_otp: loading,
    error_verify_otp: error,
    fire_verify_otp: (ref_code: string, otp: string) => {
      return fire({
        data: {
          ref_code,
          otp,
        },
      });
    },
  };
};
