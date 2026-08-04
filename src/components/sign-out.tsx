"use client";

import { useAuth, useSignOut } from "@better-auth-ui/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";

export type SignOutProps = {
  className?: string;
};

export function SignOut({ className }: SignOutProps) {
  const { basePaths, navigate, viewPaths } = useAuth();

  const getErrorMessage = (error: {
    error?: { message?: string };
    message?: string;
  }) => error.error?.message ?? error.message ?? "Something went wrong";

  const { mutate: signOut } = useSignOut({
    onError: (error) => {
      toast.error(getErrorMessage(error));

      navigate({
        to: `${basePaths.auth}/${viewPaths.auth.signIn}`,
        replace: true,
      });
    },
    onSuccess: () => {
      navigate({
        to: `${basePaths.auth}/${viewPaths.auth.signIn}`,
        replace: true,
      });
    },
  });

  const hasSignedOut = useRef(false);

  useEffect(() => {
    if (hasSignedOut.current) return;

    hasSignedOut.current = true;
    signOut();
  }, [signOut]);

  return <Spinner className={cn("mx-auto my-auto", className)} />;
}