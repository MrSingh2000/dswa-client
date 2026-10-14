import { type PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { useGetUserDetailsQuery } from "@/query/auth/login.query";
import { useEffect } from "react";
import Loader from "./loader";

const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { data: userDetails, isLoading } = useGetUserDetailsQuery();

  useEffect(() => {
    if (!isLoading && !userDetails) {
      navigate("/login");
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return children;
};

export default AuthenticatedRoute;
