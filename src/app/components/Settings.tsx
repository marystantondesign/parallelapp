import { Link, useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";

const row = "flex items-center justify-between p-4 bg-t-surface-elevated border border-t-border-subtle rounded-lg active:bg-t-surface-subtle";

export function Settings() {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-6">
      <div className="space-y-2">
        <Link to="/settings/profile" className={row}>
          <span className="text-t-text-primary">Profile</span>
          <ChevronRight className="w-5 h-5 text-t-text-placeholder" />
        </Link>

        <Link to="/settings/account" className={row}>
          <span className="text-t-text-primary">Account</span>
          <ChevronRight className="w-5 h-5 text-t-text-placeholder" />
        </Link>

        <Link to="/insights" className={row}>
          <span className="text-t-text-primary">Insights</span>
          <ChevronRight className="w-5 h-5 text-t-text-placeholder" />
        </Link>

        <button onClick={() => navigate("/onboarding")} className={`w-full ${row}`}>
          <span className="text-t-text-primary">Initiate Onboarding</span>
          <ChevronRight className="w-5 h-5 text-t-text-placeholder" />
        </button>
      </div>
    </div>
  );
}
