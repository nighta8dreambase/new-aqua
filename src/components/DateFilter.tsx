import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";

import { useParams } from "react-router-dom";
import { useReadUser } from "../services/api/user/useReadUser";
import LuxonUtils from "@date-io/luxon";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { webStore } from "../stores/webStore";
import { observer } from "mobx-react-lite";

export const DateFilter = observer(() => {
  const [startDate, setStartDate] = useState<Date | null>(
    webStore.startDate || new Date()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    webStore.endDate || new Date()
  );
  const [filterHour, setFilterHour] = useState<number | null>(
    webStore.filter_hour
  );

  const onSearch = () => {
    webStore.setStartDate(startDate);
    webStore.setEndDate(endDate);
    webStore.set_filter_hour(filterHour);
  };

  return (
    <Paper style={{ minHeight: "100%" }} className="flex item-center p-4">
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <KeyboardDatePicker
              style={{ margin: 0, width: "100%" }}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="from"
              inputVariant="outlined"
              label="From Date"
              autoOk={true}
              value={startDate}
              onChange={(date: MaterialUiPickersDate) => {
                setStartDate(date ? new Date(date.toString()) : null);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <KeyboardDatePicker
              style={{ margin: 0, width: "100%" }}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="to"
              label="To Date"
              inputVariant="outlined"
              value={endDate}
              autoOk={true}
              onChange={(date: MaterialUiPickersDate) => {
                setEndDate(date ? new Date(date.toString()) : null);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              variant="outlined"
              style={{ margin: 0, width: "100%" }}
            >
              <InputLabel id="filter_hour">Filter by Hour</InputLabel>
              <Select
                labelId="filter_hour"
                id="filter_hour"
                label="Filter by Hour"
                value={filterHour || ""}
                onChange={(event) => {
                  const input = event.target.value;
                  setFilterHour(typeof input === "number" ? input : null);
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value={1}>1 Hour</MenuItem>
                <MenuItem value={6}>6 Hours</MenuItem>
                <MenuItem value={24}>1 Day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="outlined"
              color="primary"
              style={{ margin: 0, height: "100%", width: "100%" }}
              onClick={() => onSearch()}
            >
              <Search color="primary"></Search>
            </Button>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </Paper>
  );
});
