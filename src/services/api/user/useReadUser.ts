import { User, UserFromAPI } from "../../../types/user";
import _ from "lodash";
import { callAPI, useCallAPI } from "../../useCallAPI";
import { userInfo } from "os";
import { isNull } from "util";
import { DateTime } from "luxon";
import dayjs from "dayjs";
import { dateStrAPI } from "../../../utils";
import {
  BatteryHistoryReport,
  BloodPressureHistoryReport,
  HeartRateHistoryReport,
  TempHistoryReport,
  WearingHistoryReport,
} from "../../../types/personalReport";
// export const MOCKUP_USER: User = {
//   id: Math.random().toString(),
//   name: "name",
//   avatar: "https://material-ui.com/static/images/avatar/1.jpg",
//   surname: "surname",
//   passport_id: "11231",
//   gender: "male",
//   nationality: "thai",
//   birth_date: new Date(),
//   imei: "112",
//   isSos: false,
//   yatch_name: "test",
//   length_of_stay: 10,
//   date_start: new Date(),
//   date_end: new Date(),
//   latest_lng: 10,
//   latest_lat: 10,
//   latest_body_temp: 10,
//   latest_heart_rate: 10,
//   latest_blood_pressure: "10",
//   latest_device_status: true,
//   latest_battery: "30%",
//   timeStamp: new Date(),
// };

export const processServerUser = (serverUser: UserFromAPI) => {
  // serverUser.user.avatar = "https://material-ui.com/static/images/avatar/1.jpg";
  serverUser.user.isSos = false;
  serverUser.user.yatch_name = serverUser.place?.name_th || "";
  serverUser.user.length_of_stay = serverUser.length_of_stay;
  serverUser.user.quarantine_start = serverUser.user.quarantine_start
    ? new Date(serverUser.user.quarantine_start)
    : new Date();
  serverUser.user.quarantine_end = serverUser.user.quarantine_end
    ? new Date(serverUser.user.quarantine_end)
    : new Date();

  let device;
  if (serverUser.device) {
    device = serverUser.device;
  } else if (serverUser.devices) {
    device = _.last(serverUser.devices);
  }

  if (serverUser.devices) {
    serverUser.user.total_step = _.sumBy(serverUser.devices, "step");
  } else if (serverUser.device) {
    serverUser.user.total_step = serverUser.device.step;
  } else {
    serverUser.user.total_step = "?";
  }

  if (device) {
    serverUser.user.imei = device.imei;
    serverUser.user.latest_device_status =
      device.device_status > 0 ? true : false;
    serverUser.user.latest_battery = device.battery;
  }

  if (device && device.heart_rate) {
    serverUser.user.latest_heart_rate = device.heart_rate;
  } else if (serverUser.heart_rates && serverUser.heart_rates[0]) {
    serverUser.user.latest_heart_rate = serverUser.heart_rates[0].heart_rate;
  } else {
    serverUser.user.latest_heart_rate = "?";
  }

  if (device && device.body_temp) {
    serverUser.user.latest_body_temp = device.body_temp;
  } else if (serverUser.temperatures && serverUser.temperatures[0]) {
    serverUser.user.latest_body_temp = serverUser.temperatures[0].body_temp;
  } else {
    serverUser.user.latest_body_temp = "?";
  }

  if (device && device.latitude >= 0 && device.longitude >= 0) {
    serverUser.user.latest_lat = device.latitude;
    serverUser.user.latest_lng = device.longitude;
  } else if (serverUser.locations && serverUser.locations[0]) {
    serverUser.user.latest_lat = serverUser.locations[0].latitude;
    serverUser.user.latest_lng = serverUser.locations[0].longitude;
  } else {
    serverUser.user.latest_lat = 0.1;
    serverUser.user.latest_lng = 0.1;
  }

  if (device && device.blood_systolic && device.blood_diastolic) {
    serverUser.user.latest_blood_pressure =
      device.blood_systolic + "/" + device.blood_diastolic;
  } else if (serverUser.blood_pressures && serverUser.blood_pressures[0]) {
    serverUser.user.latest_blood_pressure =
      serverUser.blood_pressures[0].blood_systolic +
      "/" +
      serverUser.blood_pressures[0].blood_diastolic;
  } else {
    serverUser.user.latest_blood_pressure = "?";
  }
  if (!serverUser.user.latest_blood_pressure) {
    serverUser.user.latest_blood_pressure = "";
  }
  serverUser.user.timeStamp = new Date(serverUser.updated_at);

  let lastDevice = _.last(serverUser.devices);
  if (lastDevice) {
    serverUser.user.latest_device_timeStamp = new Date(lastDevice.updated_at);
  }

  serverUser.user.date_start = serverUser.date_start;
  serverUser.user.date_end = serverUser.date_end;
  return serverUser.user;
};

export const callReadUser = (
  userId: string,
  endDate?: Date,
  startDate?: Date,
  filterHour?: string
) => {
  return new Promise<User>((resolve, reject) => {
    callAPI({
      url: `/api/v1/dashboard/quarantines/users/${userId}`,
      method: "GET",
      data: {
        userId,
      },
      params: {
        start_date: startDate,
        end_date: endDate,
        filter_hour: filterHour,
      },
    }).then((res: { data: { data: UserFromAPI } }) => {
      if (!res) {
        reject();
      } else {
        resolve(processServerUser(res?.data.data));
      }
    });
  });
};

export type ReadUserFilter = {
  endDate: Date | string | null;
  startDate?: Date | string | null;
  filterHour?: number | null;
};
export const useReadUser = (
  userId: string,
  filter: ReadUserFilter = {
    endDate: new Date(),
  },
  manual = false
) => {
  if (filter.endDate && typeof filter.endDate !== "string") {
    filter.endDate = dateStrAPI(filter.endDate);
  }
  if (filter.startDate && typeof filter.startDate !== "string") {
    filter.startDate = dateStrAPI(filter.startDate);
  }
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    data: UserFromAPI;
  }>(
    {
      url: `/api/v1/dashboard/quarantines/users/${userId}`,
      method: "GET",
      data: {
        userId,
      },
      params: {
        start_date: filter.startDate,
        end_date: filter.endDate,
        filter_hour: filter.filterHour,
      },
    },
    {
      manual,
    }
  );
  const result_userRead_raw = res?.data;
  let result_battery_history: null | BatteryHistoryReport = null;
  if (result_userRead_raw) {
    result_battery_history = _.sortBy(
      (result_userRead_raw.batteries || []).map(({ battery, created_at }) => {
        const timestamp = new Date(created_at);
        const diff = DateTime.fromJSDate(new Date()).diff(
          DateTime.fromJSDate(new Date(created_at)),
          "days"
        ).days;

        return {
          battery: battery,
          length_of_stay: Math.floor(diff),
          timestamp: timestamp,
        };
      }),
      "length_of_stay"
    );
  }
  let result_blood_pressure_history: null | BloodPressureHistoryReport = null;
  if (result_userRead_raw) {
    result_blood_pressure_history = _.sortBy(
      (result_userRead_raw.blood_pressures || []).map(
        ({ blood_systolic, blood_diastolic, device_id, created_at }) => {
          const timestamp = new Date(created_at);
          const diff = DateTime.fromJSDate(new Date()).diff(
            DateTime.fromJSDate(new Date(created_at)),
            "days"
          ).days;

          return {
            blood_pressure: blood_systolic + "/" + blood_diastolic,
            blood_systolic: blood_systolic,
            blood_diastolic: blood_diastolic,
            length_of_stay: Math.floor(diff),
            timestamp: timestamp,
          };
        }
      ),
      "length_of_stay"
    );
  }

  let result_heart_rate_history: null | HeartRateHistoryReport = null;
  if (result_userRead_raw) {
    result_heart_rate_history = _.sortBy(
      (result_userRead_raw.heart_rates || []).map(
        ({ heart_rate, created_at }) => {
          const timestamp = new Date(created_at);
          const diff = DateTime.fromJSDate(new Date()).diff(
            DateTime.fromJSDate(new Date(created_at)),
            "days"
          ).days;

          return {
            heart_rate: heart_rate,
            length_of_stay: Math.floor(diff),
            timestamp: timestamp,
          };
        }
      ),
      "length_of_stay"
    );
  }

  let result_temp_history: null | TempHistoryReport = null;
  if (result_userRead_raw) {
    result_temp_history = _.sortBy(
      (result_userRead_raw.temperatures || []).map(
        ({ body_temp, created_at }) => {
          const timestamp = new Date(created_at);
          const diff = DateTime.fromJSDate(new Date()).diff(
            DateTime.fromJSDate(new Date(created_at)),
            "days"
          ).days;

          return {
            body_temp: body_temp,
            length_of_stay: Math.floor(diff),
            timestamp: timestamp,
          };
        }
      ),
      "length_of_stay"
    );
  }

  let result_wearing_history: null | WearingHistoryReport = null;
  if (result_userRead_raw) {
    result_wearing_history = _.sortBy(
      (result_userRead_raw.device_status || []).map(
        ({ device_status, created_at }) => {
          const timestamp = new Date(created_at);
          const diff = DateTime.fromJSDate(new Date()).diff(
            DateTime.fromJSDate(new Date(created_at)),
            "days"
          ).days;

          return {
            device_status: device_status,
            length_of_stay: Math.floor(diff),
            timestamp: timestamp,
          };
        }
      ),
      "length_of_stay"
    );
  }

  return {
    result_userRead: res?.data ? processServerUser(res?.data) : null,
    result_battery_history,
    result_blood_pressure_history,
    result_heart_rate_history,
    result_temp_history,
    result_wearing_history,
    result_userRead_raw: res?.data,
    loading_userRead: loading,
    error_userRead: error,
    fire_userRead: fire,
  };
};
