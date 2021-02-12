import React, { useEffect, useState } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import { Box, Container, MenuItem, Paper, Select } from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useLogout } from "../../services/api/auth/useLogout";

const ListGroup = observer(
  ({
    label,
    lists,
  }: {
    label: string;
    lists: {
      label: string;
      type: string;
      link?: string;
      options?: { val: string; label: string }[];
      value?: string;
      onChange?: any;
      onlyPC?: boolean;
    }[];
  }) => {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { fire_logout } = useLogout();
    return (
      <>
        <Box
          fontSize="1.2rem"
          css={{ color: "rgba(26, 27, 34, 0.3)" }}
          fontWeight={600}
          mt={3}
          mb={1}
        >
          {label}
        </Box>
        <Box
          css={{
            borderRadius: 5,
            backgroundColor: "#fff",
          }}
        >
          {lists.map(
            (
              { label, type, link, options, value, onChange, onlyPC },
              i: number
            ) => {
              if (webStore.device === "mobile" && onlyPC) {
                return;
              }
              return (
                <Box
                  p={2}
                  borderBottom={i < lists.length - 1 ? "1px solid #ddd" : ""}
                  position="relative"
                  fontWeight={600}
                  className="cursor-pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => {
                    switch (type) {
                      case "logout":
                        fire_logout().then(() => {
                          enqueueSnackbar("ออกจากระบบ", {
                            key: "logoutSuccess",
                            variant: "success",
                            autoHideDuration: 3000,
                            anchorOrigin: {
                              vertical: "top",
                              horizontal: "center",
                            },
                          });
                        });
                        break;
                      case "selected":
                        return;
                        break;
                      default:
                        history.push(link || "");
                    }
                  }}
                >
                  {label}
                  {type === "selected" ? (
                    <Select
                      value={value || ""}
                      disableUnderline
                      onChange={onChange}
                    >
                      {options?.map((op) => {
                        return <MenuItem value={op.val}>{op.label}</MenuItem>;
                      })}
                    </Select>
                  ) : (
                    <ChevronRightIcon />
                  )}
                </Box>
              );
            }
          )}
        </Box>
      </>
    );
  }
);

export const Setting = observer((props: any) => {
  // const [lang, setLang] = useState(webStore.lang);
  // useEffect(() => {
  //   webStore.setLang(lang);
  // }, [lang]);
  const setting = [
    {
      label: "system",
      lists: [
        { label: "Push data", type: "link", link: "/setting/pushdata" },
        { label: "Notification", type: "link", link: "/setting/notification" },
        {
          label: "Geo fence",
          type: "link",
          link: "/setting/geofence",
          onlyPC: true,
        },
        // { label: "User management", type: "link", link: "/setting/user" },
      ],
    },
    // {
    //   label: "Permissions",
    //   lists: [
    //     {
    //       label: "Permission management",
    //       type: "link",
    //       link: "/setting/permission",
    //     },
    //   ],
    // },
    {
      label: "Website",
      lists: [
        {
          label: "Language",
          type: "selected",
          options: [
            { val: "en", label: "English" },
            { val: "th", label: "Thai" },
          ],
          value: webStore.lang,
          onChange: (event: React.ChangeEvent<{ value: string }>) => {
            webStore.setLang(event.target.value as string);
          },
        },
      ],
    },
    {
      label: "Account",
      lists: [
        {
          label: "Change password",
          type: "link",
          link: "/setting/changepassword",
        },
        { label: "Logout", type: "logout", link: "" },
      ],
    },
  ];
  return (
    <Container maxWidth="sm" className="py-4">
      <Box mb={2}>
        <SubBar title={"Setting"} reload={false} />
      </Box>
      {setting.map((s) => {
        return <ListGroup {...s} />;
      })}
    </Container>
  );
});
