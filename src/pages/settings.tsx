import { Card, CardContent } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your application preferences and account settings.
        </p>
      </div>

      <Card className="border border-border">
        <CardContent className="flex flex-col gap-5 p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              General Preferences
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize your experience when working on problem sheets.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                External Links
              </p>
              <p className="text-xs text-muted-foreground">
                Open LeetCode and editorial tabs in a new browser window.
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
              Always On
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                DSA Catalog Sync
              </p>
              <p className="text-xs text-muted-foreground">
                Auto-cache queries and keep problems offline-ready.
              </p>
            </div>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
