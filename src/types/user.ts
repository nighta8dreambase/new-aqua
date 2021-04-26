import { userDevice } from "./device";
import { Places } from "./places";

export type User = {
  avatar: string;
  isSos: boolean;
  yatch_name: string;
  length_of_stay: number;
  quarantine_start: Date;
  quarantine_end: Date;
  imei?: string;
  latest_lng?: number;
  latest_lat?: number;
  latest_body_temp?: number | "?";
  latest_heart_rate?: number | "?";
  latest_blood_pressure?: string | "?";
  latest_device_status?: boolean;
  latest_battery?: number;
  total_step: number | "?";
  timeStamp: Date;
  date_start?: string;
  date_end?: string;
  age: number;
  created_at: Date;
  date_of_birth: Date;
  email: string;
  gender: string;
  id: string;
  identity_card: string;
  name: string;
  nationality: string;
  passport?: {
    authority?: null;
    country_code?: null;
    created_at: string;
    date_of_birth?: null;
    date_of_expiry?: null;
    date_of_issue?: null;
    gender: string;
    height?: null;
    id: string;
    local_name?: null;
    name: string;
    nationality: string;
    passport_number: string;
    personal_no?: null;
    photo?: null;
    place_of_birth?: null;
    surname: string;
    type?: null;
    updated_at: string;
  };
  phone_number: string;
  surname: string;
  title_name: string;
  updated_at: Date;
  latest_device_timeStamp?: Date;
};
// //
export type UserImportInput = {
  branch_id: string;
  file: File;
};

export type UserCreateInput = {
  avatar: string | null;
  avatar_url: string | null;
  title_name_id: string | null;
  name: string;
  surname: string;
  gender: string;
  date_of_birth: string | Date | null;
  nationality: string;
  card_number: string;
  branch_id: string;
  place_of_use: string;
  device_id_1: string | null;
  device_id_2: string | null;
  device_provider_id: string;
  start_date: string | Date | null;
  end_date: string | Date | null;
  agency_contracted_id: string;
  hospital_contracted_id: string;
  destination_port: string | null;
  departure_port: string | null;
};
//
export type UserUpdateInput = {
  id: string;
  imei: string;
};

export type UserFromAPI = {
  id: string;
  name: string;
  isSos: boolean;
  gender: string;
  nationality: string;
  avatar: string;
  device?: userDevice;
  devices?: userDevice[];
  place?: Places;
  user: User;
  length_of_stay: number;
  created_at: string;
  date_end: string;
  date_start: string;

  blood_pressures?: {
    blood_systolic: number;
    blood_diastolic: number;
    device_id: string;
    created_at: string;
  }[];
  temperatures?: {
    created_at: string;
    BTUtcTime: string;
    body_temp: number;
    device_id: string;
    type: number;
    wristband_temp: number;
  }[];
  device_status?: {
    BTUtcTime: string;
    device_status: 0 | 1 | 2;
    created_at: string;
    device_id: string;
    signal: number;
  }[];
  batteries?: {
    BTUtcTime: string;
    battery: number;
    created_at: string;
    device_id: string;
    signal: number;
  }[];
  heart_rates?: { heart_rate: number; device_id: string; created_at: string }[];
  updated_at: string;
  locations?: {
    accuracy: number;
    device_id: string;
    latitude: number;
    longitude: number;
    location_type: number;
    created_at: string;
  }[];
};

export type Image = {
  id: string;
  file_size: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  file_format: string;
};

export type UsersQuarantine = {
  id: string;
  device?: userDevice;
  place?: Places;
  length_of_stay: number;
  user: User;
};

export type Filter = {
  startDate: Date | null;
  endDate: Date | null;
  filter_temp: string | null;
  filter_wear: string | null;
  filter_battery: string | null;
  filter_yacht_name: string | null;
  filter_Keyword: string | null;
  page: number;
  perPage: number;
};

export type UserChangePassword = {
  // old_password: string;
  new_password: string;
  new_password_again: string;
};
