"use client";

import { Crown, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const packages = [
  {
    name: "Small",
    credits: 50,
    price: "4.99",
    slug: "small",
    icon: Sparkles,
    description: "Perfect for trying out AI tools",
  },
  {
    name: "Medium",
    credits: 200,
    price: "14.99",
    slug: "medium",
    icon: Zap,
    description: "Best choice for regular use",
    popular: true,
  },
  {
    name: "Large",
    credits: 1000,
    price: "49.99",
    slug: "large",
    icon: Crown,
    description: "Maximum value for power users",
  },
] as const;

type PackageSlug = (typeof packages)[number]["slug"];

interface UpgradeProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function Upgrade({
  open,
  onOpenChange,
  showTrigger = true,
}: UpgradeProps) {
  const [loadingSlug, setLoadingSlug] =
    useState<PackageSlug | null>(null);

  const handleCheckout = async (slug: PackageSlug) => {
    if (loadingSlug) return;

    try {
      setLoadingSlug(slug);

      // Polar checkout is added to Better Auth through the Polar plugin.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await authClient.checkout({
        slug,
      });
    } catch (error) {
      console.error("CHECKOUT_START_FAILED", {
        slug,
        error,
      });

      toast.error("Unable to start checkout. Please try again.");
      setLoadingSlug(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="hover:border-violet-500/50 hover:bg-violet-500/5 w-full justify-start gap-2 transition-colors"
          >
            <Crown className="h-4 w-4 text-violet-600" />
            Buy Credits
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="w-[95vw] max-w-[680px] p-5 sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Buy Credits
          </DialogTitle>

          <DialogDescription>
            Choose a credit package. Credits never expire.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {packages.map((pack) => {
            const Icon = pack.icon;
            const isPopular =
              "popular" in pack && pack.popular;
            const isLoading = loadingSlug === pack.slug;

            return (
              <div
                key={pack.slug}
                className={`relative flex min-h-[270px] flex-col rounded-xl border p-4 transition-all ${
                  isPopular
                    ? "border-violet-500 bg-violet-500/5 ring-2 ring-violet-500/15"
                    : "border-border bg-background hover:border-violet-500/30"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold text-white">
                    Most Popular
                  </div>
                )}

                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                    isPopular
                      ? "bg-violet-500/10 text-violet-600"
                      : "bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">
                  {pack.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-bold tracking-tight ${
                      isPopular ? "text-violet-600" : ""
                    }`}
                  >
                    {pack.credits}
                  </span>

                  <span className="text-muted-foreground text-xs">
                    credits
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-muted-foreground text-xs font-medium">
                    CHF
                  </span>

                  <span className="text-xl font-bold">
                    {pack.price}
                  </span>
                </div>

                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                  {pack.description}
                </p>

                <Button
                  className={
                    isPopular
                      ? "mt-auto w-full bg-violet-600 text-white hover:bg-violet-700"
                      : "mt-auto w-full hover:border-violet-500/50 hover:bg-violet-500/5"
                  }
                  size="sm"
                  variant={isPopular ? "default" : "outline"}
                  disabled={loadingSlug !== null}
                  onClick={() => handleCheckout(pack.slug)}
                >
                  {isLoading
                    ? "Processing..."
                    : `Buy ${pack.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-muted-foreground mt-1 text-center text-[11px]">
          Secure payment powered by Polar
        </p>
      </DialogContent>
    </Dialog>
  );
}
