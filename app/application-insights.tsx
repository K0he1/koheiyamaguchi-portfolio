"use client";

import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let appInsights: ApplicationInsights | undefined;
let isInitialized = false;

export default function ApplicationInsightsProvider() {
  const pathname = usePathname();
  const connectionString =
    process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING;

  useEffect(() => {
    if (!connectionString || isInitialized) return;

    appInsights = new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
      },
    });
    appInsights.loadAppInsights();
    isInitialized = true;
  }, [connectionString]);

  useEffect(() => {
    if (!isInitialized || !appInsights) return;

    appInsights.trackPageView({ uri: window.location.href, name: pathname });
  }, [pathname]);

  return null;
}
