"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

type SwitchItemInactivoProps = {
  idItem: number;
  inactivo: boolean;
};
const SwitchItemInactivo = ({ inactivo, idItem }: SwitchItemInactivoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inactivoValor, setInactivoValor] = useState(inactivo);
  const [isLoading, setIsLoading] = useState(false);

  const alteraEstadoDeItem = async () => {
    if (isLoading) return;
    setIsLoading(true);
    /*
    try {
      const resultado = await patchEstadoItem(idItem);

      if (resultado.success) {
        setInactivoValor((prev) => !prev);
        toast.success(`Estado alterado..`, {
          description: resultado.message || "Sucesso",
        });
        return;
      }
      toast.error(`Erro ao alterar estado...`, {
        description: resultado.message || "Sucesso",
      });
    } catch (error) {
      console.error("Erro inesperado ao alterar estado do item:", error);
      toast.error("Erro inesperado ao alterar estado do item:", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsLoading(false);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("idItem");
      router.replace(`/dashboard/embarques/configurar?${params.toString()}`);
    }
      */
  };

  return (
    <>
      <Switch
        disabled={isLoading}
        id="envio-fechado"
        checked={inactivoValor}
        onCheckedChange={alteraEstadoDeItem}
      />
    </>
  );
};

export default SwitchItemInactivo;
