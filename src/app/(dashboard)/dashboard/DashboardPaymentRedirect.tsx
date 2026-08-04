"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardPaymentRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 1000);
    }
  }, [searchParams]);

  return null;
}