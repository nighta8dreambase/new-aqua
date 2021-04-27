import { TempHistoryReport } from "../../../types/personalReport";
import { User, UserCreateInput } from "../../../types/user";
import { dateStrAPI, resolveMockup } from "../../../utils";
import { useCallAPI } from "../../useCallAPI";

export const useCreateUser = () => {
  const [{ data: res, loading, error }, fire] = useCallAPI<{
    code: 0 | 1;
    message: string;
    data: User;
  }>(
    {
      url: `/api/v1/users/register/tourist/quarantines`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  return {
    result_user_create: res?.code === 1 ? res?.data : null,
    loading_user_create: loading,
    error_user_create: res?.code === 0 ? res?.message : null,
    fire_user_create: (userInput: UserCreateInput) => {
      userInput.date_of_birth = dateStrAPI(userInput.date_of_birth);
      userInput.start_date = dateStrAPI(userInput.start_date);
      userInput.end_date = dateStrAPI(userInput.end_date);
      return new Promise((resolve, reject) => {
        fire({
          data: userInput,
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
