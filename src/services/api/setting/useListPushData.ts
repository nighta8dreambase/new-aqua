import { useEffect, useState } from "react";
import { useCallAPI } from "../../useCallAPI";
import { PushDataArray, PushDataStatus } from "../../../types/setting";


export const useListPushData = () => {
  const [data, setData]: any = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const MOCKUP_PUSH_DATA: PushDataArray = [
    { status: PushDataStatus.SENDED, devices: ['Any device'], message: 'Do you still be save fjwgjiverni vgnrenviernivjgner ijgnijerngijvremnjvnmerjignm ijnj ?', time: 'Every Monday 5PM' },
    { status: PushDataStatus.SCHEDULE, devices: ['IMEI12012012', 'IMEI12012012', 'IMEI12012012', 'IMEI12012012', 'IMEI12012012', 'IMEI12012012', 'IMEI12012012', 'IMEI12012012'], message: 'Do you still be save ?', time: '13 Jan 2020  5PM' },
    { status: PushDataStatus.SENDED, devices: ['IMEI12012012', 'IMEI12012012', 'IMEI12012012'], message: 'Do you still be save ?', time: '13 Jan 2020  5PM' },
  ]

  useEffect(() => {
    setTimeout(() => {
      setData(MOCKUP_PUSH_DATA);
      setLoading(false);
    }, 2000);
  }, []);

  return {
    result: data,
    loading: loading,
    error: error,
  };
};