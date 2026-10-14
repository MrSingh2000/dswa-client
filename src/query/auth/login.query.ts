import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginRequest,
  type LoginRequest,
} from "../../api/request/login.request";
import {
  LocalStorageKeys,
  clearLocalStorage,
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
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [queryKeys.userDetails],
    queryFn: async () => {
      try {
        return await getUserDetailsRequest();
      } catch (error) {
        clearLocalStorage();
        queryClient.clear();
        throw error;
      }
    },
    enabled: !!getLocalStorage(LocalStorageKeys.token),
    retry: false,
  });
};

