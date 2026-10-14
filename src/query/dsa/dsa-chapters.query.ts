import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { getDsaSheetHierarchyRequest } from "@/api/request/chapters.request";

export const useGetDsaHierarchyQuery = () => {
  return useQuery({
    queryKey: [queryKeys.dsaHierarchy],
    queryFn: () => getDsaSheetHierarchyRequest(),
  });
};
