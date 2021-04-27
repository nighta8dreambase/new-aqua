import { User } from "./user";

export type DeviceLog = {
  id: string;
  mac_address: string;
  imei: string;
  device_provider_id?: number | null;
  bluetooth_name?: number | null;
  firmware_version?: number | null;
  model: string;
  heart_rate: number;
  battery: number;
  step: number;
  body_temp: number;
  wristband_temp: number;
  lng: number;
  lat: number;
  device_status: number;
  active: number;
  timeStamp: Date;
  created_at: string;
  updated_at: string;
  rssi?: number | null;
  user_id?: number;
  user?: User;
  blood_pressure: string;
};

export type userDevice = {
  battery: number;
  blood_diastolic: number;
  blood_systolic: number;
  bluetooth_name: string;
  body_temp: number;
  created_at: Date;
  device_status: number;
  firmware_version: string;
  heart_rate: number;
  id: string;
  imei: string;
  latitude: number;
  longitude: number;
  mac_address: string;
  model: string;
  step: number;
  updated_at: Date;
  wristband_temp: number;
};
