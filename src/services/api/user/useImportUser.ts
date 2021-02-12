import { TempHistoryReport } from "../../../types/personalReport";
import { User, UserCreateInput, UserImportInput } from "../../../types/user";
import { dateStrAPI, resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useImportUser = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: User;
  }>(
    {
      url: `/api/v1/files/import/tourist`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  return {
    result_user_import: res?.code === 1 ? res?.data : null,
    loading_user_import: loading,
    error_user_import: res?.code === 0 ? res?.message : null,
    fire_user_import: (userImportInput: UserImportInput) => {
      return new Promise((resolve, reject) => {
        fire({
          data: userImportInput,
        })
          .then(({ data: { data, code, message } }) => {
            if (code === 0) {
              reject(message);
            } else {
              resolve(data);
            }
          })
          .catch((ex) => {
            reject(ex.toString());
          });
      });
    },
  };
};
