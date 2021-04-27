import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useRequestOTP_Mock = () => {
  const [{ data, loading, error }, fire] = useCallAPI<{
    data: { phone_number: string; ref_code: string };
  }>(
    {
      url: `/auth/request_otp`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_request_otp: data?.data.phone_number,
    result_request_otp_ref: data?.data.ref_code,
    loading_request_otp: loading,
    error_request_otp: error,
    fire_request_otp: (username: string, password: string) => {
      return resolveMockup({
        data: { data: { otpTel: "********95", refCode: "112" } },
      });
      return fire({
        data: {
          username,
          password,
        },
      });
    },
  };
};

export const useRequestOTP = () => {
  const [{ data, loading, error }, fire] = useCallAPI<{
    data?: { phone_number: string; ref_code: string };
  }>(
    {
      url: `/api/v1/login-otp`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_request_otp: data?.data?.phone_number,
    result_request_otp_ref: data?.data?.ref_code,
    loading_request_otp: loading,
    error_request_otp: error,
    fire_request_otp: (username: string, password: string) => {
      return fire({
        data: {
          username,
          password,
        },
      });
    },
  };
};
