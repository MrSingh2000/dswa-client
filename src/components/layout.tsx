import { ThemeProvider, useTheme } from "@/context/theme-provider";
import { type PropsWithChildren } from "react";
import { ModeToggle } from "./mode-toggle";
import { Bounce, ToastContainer } from "react-toastify";

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
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <div className="absolute top-0 right-0 z-100 p-3 shadow-lg">
          <ModeToggle />
        </div>
        <div className="flex-1 h-full overflow-hidden">{children}</div>
      </div>
      <ThemedToastContainer />
    </ThemeProvider>
  );
};

export default Layout;
