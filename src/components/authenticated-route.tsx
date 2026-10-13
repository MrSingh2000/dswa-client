import { type PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { useGetUserDetailsQuery } from "@/query/auth/login.query";
import { useEffect } from "react";
import Loader from "./loader";
import Sidebar from "./sidebar";

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

  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <div className="flex-1 h-full w-full overflow-hidden p-6 bg-background">
        {children}
      </div>
    </div>
  );
};

export default AuthenticatedRoute;
