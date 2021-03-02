import { Places } from "./places";

export interface GeofenceBase {
  name: string;
  type: "radius" | "polygon";
  address?: string;
  radius?: number;
  max_distance: number;
  coordinates: { lat: number; lng: number }[];
  branch_id: string;
}

export interface Geofence extends GeofenceBase {
  id: string | number;
}

export interface GeofenceCreateInput extends Partial<GeofenceBase> {
  id?: string | number;
}

export interface GeofenceUpdateInput extends GeofenceBase {
  id: string | number;
}

export interface GeofenceDeleteInput extends GeofenceBase {
  id: string | number;
}
