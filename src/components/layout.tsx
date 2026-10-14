import { ThemeProvider, useTheme } from "@/context/theme-provider";
import { type PropsWithChildren } from "react";
import { ModeToggle } from "./mode-toggle";
import { Bounce, ToastContainer } from "react-toastify";
import Sidebar from "./sidebar";
import { useLocation } from "react-router";

const ThemedToastContainer = () => {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      transition={Bounce}
    />
  );
};

const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <div className="absolute top-0 right-0 z-100 p-3 shadow-lg">
          <ModeToggle />
        </div>
        <div className="flex w-full flex-1 h-full overflow-hidden">
          {!isLoginPage && <Sidebar />}
          <div className="flex-1 h-full w-full overflow-hidden p-6 bg-background">
            {children}
          </div>
        </div>
      </div>
      <ThemedToastContainer />
    </ThemeProvider>
  );
};

export default Layout;
