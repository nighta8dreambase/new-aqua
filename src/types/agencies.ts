export type Agencies = {
  id: string;
  name_en: string;
  name_th: string;
  latitude: string | null;
  longitude: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  agency_type: number | null;
  emergency_number: number | null;
};
