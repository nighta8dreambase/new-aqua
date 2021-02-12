import React, { useEffect, useState } from "react";
import { webStore } from "../../stores/webStore";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  Container,
  Grid,
  Switch,
  TextField,
} from "@material-ui/core";
import { SubBar } from "../Dashboard/Dashboard";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { EditField } from "../UserManage/UserInfoCard";

export const SetNotification = observer((props: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const [edit, setEdit] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [field, setField] = useState("");
  const notiData = [
    {
      name: "detection",
      label: "Wear detection",
      message: "This deivice has wear detection alert",
      enable: true,
    },
    {
      name: "location",
      label: "Location alert",
      message: "This deivice has wear location alert",
      enable: false,
    },
    {
      name: "sos",
      label: "SOS alert",
      message: "This deivice has wear SOS alert",
      enable: true,
    },
    {
      name: "tempurature",
      label: "Tempurature alert",
      message: "This deivice has wear tempurature alert",
      enable: false,
    },
  ];
  const [noti, setNoti] = useState(notiData);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  return (
    <Container maxWidth="sm" className="py-4">
      <Box mb={3}>
        <SubBar title={"Notification"} reload={false} back={true} />
      </Box>
      {noti.map((n, i) => {
        return (
          <Box
            css={{
              borderRadius: 5,
              backgroundColor: "#fff",
            }}
            p={2}
            mb={1}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box fontWeight={600}>{n.label}</Box>
              <Switch
                checked={noti[i].enable}
                color="primary"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  noti[i].enable = event.target.checked;
                  setNoti(noti);
                  console.log(noti);
                }}
                name={n.name}
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </Box>
            <Grid container>
              <Grid item xs={3}>
                <Box color="#8F919C">Messege</Box>
              </Grid>
              <Grid item xs={8}>
                <Box color="#4B4C56">{n.message}</Box>
              </Grid>
              <Grid item xs={1} css={{ textAlign: "center" }}>
                <BorderColorIcon
                  fontSize="small"
                  css={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsEdit(true);
                    setEditLabel(noti[i].label);
                    setEdit(noti[i].message);
                    setField(noti[i].name);
                    console.log("edit noti message");
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      })}
      <EditField
        label={editLabel}
        field={field}
        buttonName="SAVE"
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        value={edit}
        setValue={setEdit}
        onClick={async () => {
          // todo
          console.log("edit");
        }}
      />
    </Container>
  );
});
