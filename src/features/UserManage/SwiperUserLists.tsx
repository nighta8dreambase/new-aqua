import { Box, LinearProgress } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Filter, UsersQuarantine } from "../../types/user";
import { UserItem } from "../Dashboard/CardUserList";
import { Swiper, SwiperSlide } from "swiper/react";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";
import { realpath } from "fs";
import { useListUser } from "../../services/api/user/useListUser";

export const SwiperUserLists = observer(
  ({
    result_userList,
    loading_userList,
    total = 0,
    filter,
    mapRef,
    setPage,
  }: {
    result_userList: UsersQuarantine[];
    loading_userList: boolean;
    total?: number;
    mapRef?: any;
    filter?: Filter;
    setPage: (pn: number) => void;
  }) => {
    const [userLiser, setUserLiser] = useState<UsersQuarantine[]>([]);
    useEffect(() => {
      setUserLiser([...userLiser, ...result_userList]);
    }, [result_userList]);
    const pageCount = Math.ceil(total / (filter?.perPage || 10));
    const page = filter?.page || 1;
    const ref = useRef<{
      users?: UsersQuarantine[];
    }>();
    useEffect(() => {
      if (!ref.current) {
        ref.current = {};
      }
      ref.current.users = userLiser;
    }, [userLiser]);
    const focusMap = useCallback(
      (realIndex: number) => {
        var index = realIndex + 1;
        if (realIndex === 0) {
          mapRef &&
            mapRef.current &&
            userLiser[realIndex]?.device?.longitude &&
            userLiser[realIndex]?.device?.latitude &&
            mapRef.current.focus &&
            mapRef.current.focus(
              userLiser[realIndex]?.device?.latitude,
              userLiser[realIndex]?.device?.longitude,
              index.toString()
            );
        } else if (ref.current?.users) {
          mapRef &&
            mapRef.current &&
            ref.current?.users[realIndex]?.device?.longitude &&
            ref.current?.users[realIndex]?.device?.latitude &&
            mapRef.current.focus &&
            mapRef.current.focus(
              ref.current?.users[realIndex]?.device?.latitude,
              ref.current?.users[realIndex]?.device?.longitude,
              index.toString()
            );
        }
      },
      [userLiser.map((u) => u.id).join(",")]
    );
    return (
      <Box
        className="relative"
        css={{
          backgroundColor: "#fff",
          borderRadius: 5,
          cursor: "pointer",
          "@media (max-width: 992px)": { backgroundColor: "transparent" },
          height: "100%",
        }}
      >
        {userLiser.length > 0 && (
          <Box py={2} pl={1} className="flex">
            <Swiper
              observer={true}
              spaceBetween={10}
              slidesPerView="auto"
              onSlideChange={(swiper) => {
                focusMap(swiper.realIndex);
              }}
              onSwiper={(swiper) => focusMap(swiper.realIndex)}
            >
              {(userLiser || []).map((user, i) => {
                return (
                  <SwiperSlide className="w-10/12">
                    <UserItem {...user} index={i + 1} borderTop={i !== 0} />
                  </SwiperSlide>
                );
              })}
              {page < pageCount && (
                <SwiperSlide>
                  <Box
                    onClick={() => {
                      setPage(page + 1);
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md	"
                  >
                    <NavigateNextRoundedIcon />
                  </Box>
                </SwiperSlide>
              )}
            </Swiper>
          </Box>
        )}
      </Box>
    );
  }
);
