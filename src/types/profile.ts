import { type } from "os";
export type Project = {
  id: string;
  is_quarantine?: number;
  project_key: string;
  name_th: string;
};
export type Profile = {
  id: string;
  logo?: string;

  avatar?: string;
  age: string;
  name: string;
  email: string;
  gender: string;
  surname: string;
  passport: string;
  created_at: string;
  title_name: string;
  updated_at: string;
  nationality: string;
  phone_number: string;
  date_of_birth: string;
  identity_card: string;
  project: Project[];
};
