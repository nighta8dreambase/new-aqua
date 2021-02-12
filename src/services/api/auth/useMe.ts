import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { webStore } from "../../../stores/webStore";
import { Profile } from "../../../types/profile";
import { resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

// const MOCKUP_PROFILE: Profile = {
//   // id: "id",
//   // username: "username",
//   // display_name: "display_name",
//   // logo: "https://material-ui.com/static/logo_raw.svg",
//   // avatar: "https://material-ui.com/static/images/avatar/1.jpg",
// };
// export const useMe = () => {
//   console.log("me", localStorage.getItem("token"));
//   return {
//     result_me: localStorage.getItem("token") && MOCKUP_PROFILE,
//     loading_me: false,
//     error_me: false,
//   };
// };

export const useMe = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: Profile;
  }>({
    url: `/api/v2/users/me`,
    method: "GET",
  });

  let user = res?.data;
  if (user) {
    // user.logo = "https://material-ui.com/static/logo_raw.svg";
    // user.avatar = "https://material-ui.com/static/images/avatar/1.jpg";
  }
  return {
    result_me: localStorage.getItem("token") ? user : null,
    loading_me: loading,
    error_me: error,
  };
};
