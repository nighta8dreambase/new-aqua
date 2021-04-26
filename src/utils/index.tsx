import { DateTime } from "luxon";
import dayjs from "dayjs";

export const resolveMockup = <T,>(data: T) => {
  let r: Promise<T> = new Promise((resolve) => {
    return resolve(data as T);
  });
  return r;
};

export const dateStr = (date: Date) => {
  if (!date) {
    return "";
  }
  // console.log(date);
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED);
};

export const dateStrAPI = (date: Date | string | null) => {
  if (!date) {
    return null;
  }
  return dayjs(date).format("YYYY-MM-DD");
};

export const timeStr = (date: Date | string | null) => {
  if (!date) {
    return null;
  }
  return dayjs(date).format("h:mm A");
};
