import { useHistory } from "react-router-dom";
import { webStore } from "../../../stores/webStore";
import { Profile } from "../../../types/profile";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useVerifyOTP_Mock = () => {
  const history = useHistory();
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      access_token: string;
    };
  }>(
    {
      url: `/api/v1/login`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_token: res?.data?.access_token,
    loading_verify_otp: loading,
    error_verify_otp: error,
    fire_verify_otp: (
      ref_code: string,
      otp: string,
      username: string,
      password: string
    ) => {
      return fire({
        data: {
          username,
          password,
        },
      }).then(({ data }) => {
        localStorage.setItem("token", data.data.access_token);
        history.push("/");
      });
    },
  };
};

export const useVerifyOTP = () => {
  const history = useHistory();
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: {
      access_token: string;
    };
  }>(
    {
      url: `/api/v1/verify-login-otp`,
      method: "POST",
    },
    { manual: true }
  );
  return {
    result_token: res?.data?.access_token,
    loading_verify_otp: loading,
    error_verify_otp: error,
    fire_verify_otp: (
      ref_code: string,
      otp: string,
      username: string,
      password: string
    ) => {
      return fire({
        data: {
          ref_code,
          otp,
        },
        // }).then(({ data }) => {
        //   localStorage.setItem("token", data.data.access_token);
        //   history.push("/");
      });
    },
  };
};
