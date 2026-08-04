"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { authClient } from "~/lib/auth-client";

type CustomerPortalAuthClient = {
  customer: {
    portal: () => Promise<unknown>;
  };
};

export default function CustomerPortalRedirect() {
  useEffect(() => {
    const portalClient = authClient as unknown as CustomerPortalAuthClient;

    void portalClient.customer.portal();
  }, []);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading your customer portal...
        </p>
      </div>
    </div>
  );
}