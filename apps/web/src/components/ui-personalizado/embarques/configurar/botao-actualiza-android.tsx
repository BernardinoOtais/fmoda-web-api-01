"use client";
import { useMutation } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

const BoataoActualizaAndroid = () => {
  const trpc = useTRPC();
  const [isLoading, setIsLoading] = React.useState(false);

  const actualizaDadosAndroid = useMutation(
    trpc.embarquesConfigurar.updateAndroidData.mutationOptions({
      onSuccess: (data) => {
        if (data.status === "nothing-to-update") {
          toast.info(data.message); // Informational toast
        } else {
          toast.success(data.message); // Success toast
        }
      },
      onError: (_error) => {
        toast.error("Erro...", {
          description:
            _error instanceof Error ? _error.message : "Erro desconhecido",
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    })
  );

  return (
    <Button
      onClick={() => {
        setIsLoading(true);
        actualizaDadosAndroid.mutate();
      }}
      variant="outline"
      className="m-1 mx-auto"
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      Actualiza Partes de Android
    </Button>
  );
};

export default BoataoActualizaAndroid;
