import { SocialLinks } from "@/const/social-links.const";
import { useGetUserDetailsQuery } from "@/query/auth/login.query";
import { clearLocalStorage } from "@/utils/local-storage";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import {
  ExternalLink,
  Globe,
  LayoutDashboard,
  BriefcaseBusiness,
  type LucideIcon,
  Bug,
  TableOfContents,
  Gauge,
  CalendarCheck2,
  LogOut,
  Lock,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import PerformLoginDialog from "./perform-login-dialog";

type NavOption = {
  title: string;
  icon: LucideIcon;
  path: string;
  protected?: boolean;
};

const navOptions: NavOption[] = [
  {
    title: "All Problems",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Chapters",
    icon: TableOfContents,
    path: "/chapters",
  },
  {
    title: "Progress",
    icon: Gauge,
    path: "/progress",
    protected: true,
  },
  {
    title: "Calendar",
    icon: CalendarCheck2,
    path: "/calendar",
    protected: true,
  },
];

const Sidebar = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [performLoginDialogVisible, setPerformLoginDialogVisible] =
    useState(false);

  const { data: userDetails } = useGetUserDetailsQuery();

  const isLoggedIn = !!userDetails?.email;

  const handleLogOut = () => {
    clearLocalStorage();
    queryClient.resetQueries();
    navigate("/");
  };

  const handleNavigation = (path: string, isProtected: boolean = false) => {
    if (isProtected && !isLoggedIn) {
      setPerformLoginDialogVisible(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-md">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Bug className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              DSA Sheet
            </h2>
            <p className="text-xs text-muted-foreground">Track & Conquer</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navOptions.map((option, index) => {
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleNavigation(option.path, option.protected)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  location.pathname === option.path
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.title}
                {option.protected && !isLoggedIn ? (
                  <Lock className="h-4 w-4 ml-auto" />
                ) : null}
              </button>
            );
          })}
        </nav>

        {isLoggedIn ? (
          <div className="p-3 border-t border-border/60 space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5 border border-border/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                {(userDetails?.name || userDetails?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">
                  {userDetails?.name
                    ? `Hi, ${userDetails.name}`
                    : "Welcome back!"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                  {userDetails?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogOut}
              className={
                "flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer text-destructive hover:bg-destructive/10"
              }
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="p-3">
            <button
              type="button"
              className={
                "flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer text-primary hover:bg-primary/10"
              }
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
          </NavLink>
        )}

        {/* Sidebar Footer info */}
        <div className="border-t border-border p-3 space-y-1">
          <a
            href={SocialLinks.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors group"
          >
            <span className="flex items-center gap-2.5">
              <BriefcaseBusiness className="h-4 w-4 text-[#0A66C2]" />
              LinkedIn
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href={SocialLinks.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors group"
          >
            <span className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-primary" />
              Portfolio
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </aside>
      <PerformLoginDialog
        open={performLoginDialogVisible}
        onOpenChange={setPerformLoginDialogVisible}
      />
    </>
  );
};

export default Sidebar;
