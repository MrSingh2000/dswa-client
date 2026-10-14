import { SocialLinks } from "@/const/social-links.const";
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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

type NavOption = {
  title: string;
  icon: LucideIcon;
  path: string;
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
  },
  {
    title: "Calendar",
    icon: CalendarCheck2,
    path: "/calendar",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
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
        {navOptions.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleNavigation(option.path)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              location.pathname === option.path
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.title}
          </button>
        ))}
      </nav>

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
  );
};

export default Sidebar;
