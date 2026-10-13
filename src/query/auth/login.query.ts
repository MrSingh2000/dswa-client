import { useMutation, useQuery } from "@tanstack/react-query";
import {
  loginRequest,
  type LoginRequest,
} from "../../api/request/login.request";
import {
  LocalStorageKeys,
  getLocalStorage,
  setLocalStorage,
} from "@/utils/local-storage";
import { queryKeys } from "../query-keys";
import { getUserDetailsRequest } from "@/api/request/user.request";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => loginRequest(data),
    onSuccess: (data) => {
      if (data?.token) {
        setLocalStorage(LocalStorageKeys.token, data.token);
      }
    },
  });
};

export const useGetUserDetailsQuery = () => {
  return useQuery({
    queryKey: [queryKeys.userDetails],
    queryFn: () => getUserDetailsRequest(),
    enabled: !!getLocalStorage(LocalStorageKeys.token),
  });
};
