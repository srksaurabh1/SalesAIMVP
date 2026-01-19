import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Target } from "lucide-react";

export function RoleToggle() {
  const { role, toggleRole, getRoleLabel, getRoleDescription } = useRole();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            {getRoleLabel()}
          </span>
          <span className="text-xs text-muted-foreground">
            {getRoleDescription()}
          </span>
        </div>
      </div>

      <Button
        onClick={toggleRole}
        variant="outline"
        size="sm"
        className="min-w-fit"
      >
        <div className="flex items-center gap-2">
          {role === "sdr" ? (
            <>
              <Zap className="w-4 h-4" />
              <span>Switch to AE</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>Switch to SDR</span>
            </>
          )}
        </div>
      </Button>
    </div>
  );
}
