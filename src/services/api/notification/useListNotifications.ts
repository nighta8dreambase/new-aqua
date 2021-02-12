import { useEffect, useState } from "react";
import { NotificationArray, NotificationType } from "../../../types/notification";
import { useCallAPI } from "../../useCallAPI";


export const useListNotifications = () => {
  const [data, setData]: any = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const MOCKUP_NOTIFICATION: NotificationArray = [
    { type: NotificationType.ERROR, title: 'There is new alertfaijgio sjiogejwio gjiwoejgriorwiogvrjwio jgewi fewkojgorewj ogjreio gjoierjogvjo rejfoijeroj goiwj', content: 'This is notification alert description fjio gjreiogjoerjno gjeriogjiorej iogjerio gjioerj iajgioweigjrewi jgfirewjg irejwiugj rewi', datetime: new Date("2021-01-31 19:44"), read: false },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-31 17:35"), read: false },
    { type: NotificationType.INFO, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-31 16:04"), read: false },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-30 17:04"), read: false },
    { type: NotificationType.INFO, title: 'There is new information', content: 'This is notification information description', datetime: new Date("2021-01-30 06:54"), read: true },
    { type: NotificationType.INFO, title: 'There is new information', content: 'This is notification information description', datetime: new Date("2021-01-24 06:44"), read: true },
    { type: NotificationType.INFO, title: 'There is new information', content: 'This is notification information description', datetime: new Date("2021-01-23 08:42"), read: true },
    { type: NotificationType.INFO, title: 'There is new information', content: 'This is notification information description', datetime: new Date("2021-01-22 11:22"), read: true },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-21 05:02"), read: true },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-21 02:02"), read: true },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-20 02:01"), read: true },
    { type: NotificationType.ERROR, title: 'There is new alert', content: 'This is notification alert description', datetime: new Date("2021-01-18 00:08"), read: true },
  ]

  useEffect(() => {
    setTimeout(() => {
      setData(MOCKUP_NOTIFICATION);
      setLoading(false);
    }, 2000);
  }, []);

  return {
    result: data,
    loading: loading,
    error: error,
  };
};