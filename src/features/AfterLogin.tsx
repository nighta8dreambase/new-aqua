import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMe } from "../services/api/auth/useMe";
import { webStore } from "../stores/webStore";
import logo from "../components/assets/PMH.svg";
export const AfterLogin = () => {
  const { result_me, loading_me } = useMe();
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("set profile", result_me, loading_me, pathname);
    if (!loading_me && result_me) {
      result_me.logo = logo;
      webStore.setProfile(result_me);
    }
  }, [localStorage.getItem("token"), loading_me, pathname || "/"]);
  return <></>;
};
