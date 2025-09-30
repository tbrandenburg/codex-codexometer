import React from "react";

interface UpdateStatusBannerProps {
  lastUpdated: string;
  healthy: boolean;
}

export const UpdateStatusBanner: React.FC<UpdateStatusBannerProps> = ({ lastUpdated, healthy }) => {
  return (
    <div className="glass-panel p-4 sm:p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-3 w-3 rounded-full ${healthy ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`}
        ></span>
        <div>
          <p className="text-sm font-medium text-emerald-50">Supabase pipeline {healthy ? "operational" : "degraded"}</p>
          <p className="text-xs text-brand-100/70">Last refreshed {lastUpdated}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-brand-100/70">
        <a
          href="#methodology"
          className="underline decoration-dotted hover:text-emerald-50"
        >
          View methodology
        </a>
        <a
          href="#quality"
          className="underline decoration-dotted hover:text-emerald-50"
        >
          QA log
        </a>
      </div>
    </div>
  );
};
