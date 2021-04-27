import { TempHistoryReport } from "../../../types/personalReport";
import { User, UserCreateInput } from "../../../types/user";
import { dateStrAPI, resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useUploadImage = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: number;
    message: string;
    data?: {
      id: string;
      image_url: string;
    };
  }>(
    {
      url: `/api/v1/files/images/uploads`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    {
      manual: true,
    }
  );
  return {
    result_upload_image: res?.data,
    loading_upload_image: loading,
    fire_upload_image: (formData: any) => {
      return fire({
        data: formData,
      });
    },
  };
};
