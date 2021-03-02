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
  Grid,
  Box,
  Modal,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { User } from "../../types/user";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";
import { observer } from "mobx-react-lite";

import { dateStr, dateStrAPI } from "../../utils";
import { useSnackbar } from "notistack";
import { useUpdateUser } from "../../services/api/user/useUpdateUser";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import CloseIcon from "@material-ui/icons/Close";
import { InputDate } from "./UserCreate";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { keyframes } from "@emotion/react";
import { useClipboard } from "use-clipboard-copy";

const Field = observer(
  ({
    label,
    value,
    copy,
    edit,
    ...rest
  }: {
    label?: string;
    value: any;
    copy?: boolean;
    edit?: any;
  }) => {
    const { enqueueSnackbar } = useSnackbar();
    const clipboard = useClipboard();
    return (
      <Box my={1}>
        <Box fontSize={14} css={{ color: "rgba(255, 255, 255, 0.5)" }}>
          {label}
        </Box>

        <Box fontSize={18} display="flex" alignItems="center">
          {copy ? (
            <Box
              css={{ cursor: "pointer" }}
              onClick={() => {
                clipboard.copy(value);
                enqueueSnackbar(`copy ${value}`, {
                  variant: "success",
                  autoHideDuration: 3000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                });
              }}
            >
              {value}
              <FileCopyIcon
                css={{ fontSize: 14, marginLeft: 5, cursor: "pointer" }}
              />
            </Box>
          ) : (
            value
          )}
          {edit && (
            <BorderColorIcon
              css={{ fontSize: 14, marginLeft: 5, cursor: "pointer" }}
              onClick={edit}
            />
          )}
        </Box>
      </Box>
    );
  }
);

export const EditField = observer(
  ({
    isEdit,
    label,
    value,
    field,
    onClick,
    setIsEdit,
    type = "text",
    setValue,
    buttonName = "SAVE",
  }: {
    isEdit: boolean;
    setIsEdit: any;
    label: string;
    field: string;
    value: any;
    onClick?: any;
    type?: string;
    setValue: any;
    buttonName?: string;
  }) => {
    return (
      <Modal
        open={isEdit}
        onClose={() => {}}
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          css={{ backgroundColor: "#fff", width: 300, borderRadius: 5 }}
          p={2}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Box css={{ color: "#4B4C56" }} fontSize={14}>
              {label}
            </Box>
            <Box
              onClick={() => {
                setIsEdit(false);
              }}
            >
              <CloseIcon css={{ cursor: "pointer" }} />
            </Box>
          </Box>
          <Box>
            {type === "text" && (
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                value={value}
                defaultValue={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setValue({
                    label: label,
                    type: type,
                    field: field,
                    value: event.target.value,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={onClick}
                      color="primary"
                      size="small"
                      variant="text"
                    >
                      {buttonName}
                    </Button>
                  ),
                }}
              />
            )}
            {type === "date" && (
              <Box display="flex">
                <InputDate
                  input={{ label: "", name: "start_date" }}
                  value={value}
                  onChange={(date: MaterialUiPickersDate) => {
                    setValue({
                      label: label,
                      type: type,
                      field: field,
                      value: date ? new Date(date.toString()) : null,
                    });
                  }}
                  error={false}
                />
                <Button
                  onClick={onClick}
                  color="primary"
                  size="small"
                  variant="text"
                >
                  {buttonName}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    );
  }
);

export const UserInfoCard = ({
  user,
  userRaw,
  reload,
}: {
  user: User;
  userRaw?: any;
  reload: any;
}) => {
  console.log("user", userRaw);
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { fire_userUpdate } = useUpdateUser();
  const [dateStart, setDateStart] = useState(user.date_start || "?");
  const [dateEnd, setDateEnd] = useState(user.date_end || "?");
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Grid container spacing={2}>
      <Grid item md={3} xs={12}>
        <Field label="Place Name" value={user.yatch_name.toString()} />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field label="Date of birth" value={user.date_of_birth} />
      </Grid>
      <Grid item md={6} xs={12}>
        <Field
          label="Passport Number"
          value={user.passport?.passport_number.toString()}
          copy={true}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field label="Length of stay" value={user.length_of_stay.toString()} />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field
          label="Start quarantine"
          value={dateStrAPI(dateStart)}
          edit={() => {
            setEditValue({
              label: "Edit start quarntine",
              value: user.date_start ? dateStrAPI(user.date_start) : "",
              type: "date",
              field: "date_start",
            });
            setIsEdit(true);
          }}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field
          label="End quarantine"
          value={dateStrAPI(dateEnd)}
          edit={() => {
            setEditValue({
              label: "Edit end quarntine",
              value: user.date_end ? dateStrAPI(user.date_end) : "",
              type: "date",
              field: "date_end",
            });
            setIsEdit(true);
          }}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field label="Type" value={user.passport?.type || "?"} />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field
          label="Contracted hospital"
          value={userRaw?.hospital?.name_en || "?"}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field
          label="Contracted agency"
          value={userRaw?.agency?.name_en || "?"}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field label="Departure port" value={userRaw?.departure_port || "?"} />
      </Grid>
      <Grid item md={3} xs={12}>
        <Field
          label="Destination port"
          value={userRaw?.destination_port || "?"}
        />
      </Grid>
      <EditField
        {...editValue}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setValue={setEditValue}
        onClick={async () => {
          setLoading(true);
          if (editValue.field === "date_start") {
            await setDateStart(editValue.value);
            await fire_userUpdate({ ...user, date_start: editValue.value });
          }
          if (editValue.field === "date_end") {
            await setDateEnd(editValue.value);
            await fire_userUpdate({ ...user, date_end: editValue.value });
          }
          setDateStart(editValue.value);
          await reload();
          setIsEdit(false);
          setLoading(false);
          enqueueSnackbar(`${editValue.label} success`, {
            key: "updateSuccess",
            variant: "success",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        }}
      />
    </Grid>
  );
};

export const UserProfile = ({ user, reload }: { user: User; reload: any }) => {
  // console.log("user", user);
  return (
    <Box display="flex" alignItems="center">
      <Box mr={3}>
        <Avatar
          src={user.avatar}
          alt={user.name}
          css={{ width: "80px", height: "80px" }}
        />
      </Box>
      <Box>
        <Box fontSize="h6.fontSize" fontWeight={600}>
          {`${user.name.toString()} ${user.surname.toString()}`}
        </Box>
        <Box fontSize={14}>{`${
          user.gender == "m"
            ? "Male"
            : user.gender == "f"
            ? "Female"
            : user.gender.toString()
        }, ${user.nationality.toString()}`}</Box>
      </Box>
    </Box>
  );
};
