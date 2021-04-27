import { useEffect, useState } from "react";
import { Geofence } from "../../../types/geofence";

import { useCallAPI } from "../../useCallAPI";

const GEO_FENCES: Geofence[] = [
  {
    id: 1,
    branch_id: "2",
    name: "วง A",
    max_distance : 9,
    type: "radius",
    radius: 74758.42357508562,
    coordinates: [{ lat: 17.33161298442164, lng: 97.94708697211877 }],
  },
  {
    id: 2,
    branch_id: "2",
    name: "วง B",
    max_distance : 12,
    type: "radius",
    radius: 100882.65023493911,
    coordinates: [{ lat: 16.659199302382707, lng: 100.36407915961877 }],
  },
  {
    id: 3,
    branch_id: "2",
    name: "รอบเกาะราชาน้อย",
    max_distance : 3,
    type: "polygon",
    coordinates: [
      { lat: 15.762010085094655, lng: 98.96991412055627 },
      { lat: 13.380421608907161, lng: 96.04755083930627 },
      { lat: 12.137502520219059, lng: 98.50848833930627 },
      { lat: 13.743540737241316, lng: 99.69501177680627 },
    ],
  },
  {
    id: 4,
    branch_id: "2",
    name: "รอบเมือง",
    max_distance : 6,
    type: "polygon",
    coordinates: [
      { lat: 15.52926647730416, lng: 97.47577349555627 },
      { lat: 13.999522573771797, lng: 100.50800005805627 },
      { lat: 15.888849021951101, lng: 100.33221880805627 },
      { lat: 15.698560841787415, lng: 100.09051958930627 },
      { lat: 16.10006946670407, lng: 99.67303912055627 },
      { lat: 15.465745152169568, lng: 99.10175005805627 },
    ],
  },
];

export const useListAllGeofence_Mockup = () => {
  const [val, setVal] = useState<Geofence[] | undefined>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setVal(GEO_FENCES);
    setLoading(false);
  }, []);
  return {
    result_geofenceList: val || [],
    total: val?.length || 0,
    loading_geofenceList: loading,
    error_geofenceList: null,
    fire_geofenceList: () => {},
  };
};

export const useListAllGeofence = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: Geofence[];
  }>({
    url: `/api/v1/geofence`,
    method: "GET",
  });

  // console.log("useListAllGeofence", res?.data);

  return {
    result_geofenceList: res?.data || [],
    total: res?.data?.length || 0,
    loading_geofenceList: loading,
    error_geofenceList: error,
    fire_geofenceList: fire,
  };
};
