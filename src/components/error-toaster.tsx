import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type AppError = {
  error?: {
    message?: string;
  };
  message?: string;
};

const getErrorMessage = (error: unknown) => {
  const err = error as AppError;
  return err.error?.message ?? err.message ?? "Something went wrong";
};

export function ErrorToaster() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.getQueryCache().config.onError = (error: unknown) => {
      toast.error(getErrorMessage(error));
    };

    queryClient.setMutationDefaults([], {
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error));
      },
    });
  }, [queryClient]);

  return null;
}