export type LocationHistoryReport = {
  name: string;
  lng: number;
  lat: number;
  timestamp: Date;
  length_of_stay?: number;
}[];

export type TempHistoryReport = {
  body_temp: number;
  length_of_stay?: number;
  timestamp: Date;
}[];

export type HeartRateHistoryReport = {
  heart_rate: number;
  length_of_stay?: number;
  timestamp: Date;
}[];

export type BatteryHistoryReport = {
  battery: number;
  length_of_stay?: number;
  timestamp: Date;
}[];

export type BloodPressureHistoryReport = {
  blood_systolic: number;
  blood_diastolic: number;
  length_of_stay?: number;
  timestamp: Date;
}[];

/*
  0 = ถอด
  1 = สวมใส
  2 = ปิดเครื่อง
*/
export type WearingHistoryReport = {
  device_status: 0 | 1 | 2;
  length_of_stay?: number;
  timestamp: Date;
}[];
