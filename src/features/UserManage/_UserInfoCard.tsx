import {
  ListItem,
  ListItemText,
  List,
  Divider,
  Button,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { User } from "../../types/user";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";

import { dateStr, dateStrAPI } from "../../utils";
import { useSnackbar } from "notistack";
import { useUpdateUser } from "../../services/api/user/useUpdateUser";
const Field = ({
  label,
  value,
  divider,
  style,
  onClick,
  button = true,
  ...rest
}: {
  label?: string;
  value: any;
  divider?: boolean;
  onClick?: any;
  style?: any;
  button?: any;
}) => {
  return (
    <>
      <ListItem button={button} onClick={onClick} style={style} {...rest}>
        {label && (
          <ListItemText
            primaryTypographyProps={{
              style: {
                fontSize: "small",
              },
            }}
            style={{
              maxWidth: 160,
              minWidth: 160,
            }}
            primary={label}
          />
        )}
        <ListItemText
          style={{
            fontWeight: "bold",
            fontSize: "small",
          }}
          primaryTypographyProps={{
            style: {
              fontWeight: "bold",
              fontSize: "small",
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
            },
          }}
          primary={value}
        />
      </ListItem>
      {divider !== false && <Divider />}
    </>
  );
}; //
const IMEIField = ({ user, reload }: { user: User; reload: any }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fire_userUpdate } = useUpdateUser();
  const [v, setVal] = useState((user.imei || "").toString());
  const { enqueueSnackbar } = useSnackbar();
  if (isEdit) {
    return (
      <Field
        button={false}
        label="Wrisband IMEI number"
        onClick={() => {
          if (!isEdit) {
            setIsEdit(true);
          }
        }}
        value={
          <>
            <TextField
              label="Enter new IMEI"
              size="small"
              variant="outlined"
              onChange={(e) => {
                setVal(e.target.value);
              }}
              disabled={loading}
              value={v}
            />
            {!loading && (
              <div className="flex">
                <IconButton
                  onClick={async () => {
                    setLoading(true);
                    await fire_userUpdate({ ...user, imei: v });
                    await reload();
                    setIsEdit(false);
                    setLoading(false);
                    enqueueSnackbar("แก้ไข IMEI สำเร็จ", {
                      key: "updateSuccess",
                      variant: "success",
                      autoHideDuration: 3000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    });
                  }}
                  size="small"
                  color="primary"
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setVal((user.imei || "").toString());
                    setIsEdit(false);
                  }}
                  size="small"
                >
                  <CancelIcon />
                </IconButton>
              </div>
            )}
            {loading && <CircularProgress size="1rem" color="inherit" />}
          </>
        }
      />
    );
  }
  return (
    <Field
      label="Wrisband IMEI number"
      onClick={() => {
        if (!isEdit) {
          setVal((user.imei || "").toString());
          setIsEdit(true);
        }
      }}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
      value={
        <>
          {(user.imei || "").toString()}
          <div className="flex">
            <IconButton size="small" color="primary">
              <EditIcon />
            </IconButton>
          </div>
        </>
      }
    />
  );
};
export const UserInfoCard = ({ user, reload }: { user: User; reload: any }) => {
  console.log("user.avatar", user.avatar);
  return (
    <List component="nav">
      <Field
        // label="Avatar"
        value={
          <Avatar
            src={user.avatar}
            alt={user.name}
            css={{ width: "176px", height: "176px" }}
          />
        }
      />
      <Field
        label="Name"
        value={user.name.toString() + " " + user.surname.toString()}
      />
      <Field
        label="Passport number"
        value={user.passport?.passport_number.toString()}
      />
      <IMEIField user={user} reload={reload} />
      <Field label="Nationality" value={user.nationality.toString()} />
      <Field
        label="Gender"
        value={
          user.gender == "m"
            ? "Male"
            : user.gender == "f"
            ? "Female"
            : user.gender.toString()
        }
      />

      <Field label="Date of Birth" value={user.date_of_birth} />
      <Field label="Type" value={user.passport?.type} />
      <Field label="Yatch name" value={user.yatch_name.toString()} />
      <Field
        label="Start quarantine "
        value={user.date_start ? dateStrAPI(user.date_start) : "?"}
      />
      <Field
        label="End quarantine"
        value={user.date_end ? dateStrAPI(user.date_end) : "?"}
      />

      <Field label="Length of stay" value={user.length_of_stay.toString()} />
      <Field label="Longitude" value={(user.latest_lng || "").toString()} />
      <Field label="Latitude" value={(user.latest_lat || "").toString()} />
      <Field
        label="Body temp"
        value={(user.latest_body_temp || "").toString()}
      />
      <Field
        label="Heart rate"
        value={(user.latest_heart_rate || "").toString()}
      />
      <Field
        label="Blood pressure"
        value={(user.latest_blood_pressure || "").toString()}
      />
      <Field
        label="Device status"
        value={(user.latest_device_status || "").toString()}
      />
      <Field label="Battery" value={(user.latest_battery || "").toString()} />
      <Field
        divider={false}
        label="Timestamp"
        value={
          user.latest_device_timeStamp
            ? dateStr(user.latest_device_timeStamp)
            : user.updated_at
            ? dateStr(new Date(user.updated_at))
            : "?"
        }
      />
    </List>
  );
};
