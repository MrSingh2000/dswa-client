import { ThemeProvider } from "@/context/theme-provider";
import { type PropsWithChildren } from "react";
import { ModeToggle } from "./mode-toggle";

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <div className="justify-end flex p-3 shadow-lg">
          <ModeToggle />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default Wrapper;
