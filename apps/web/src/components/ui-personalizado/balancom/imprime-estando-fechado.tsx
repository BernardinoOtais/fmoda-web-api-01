"use client";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import DialogoImprimeBm from "./imprime-bm/dialogo-imprime-bm";

import { Button } from "@/components/ui/button";

type ImprimeEstandoFechado = {
  mostraBotao?: boolean;
  op: number;
  idBm: string;
};
const ImprimeEstandoFechado = ({
  mostraBotao,
  op,
  idBm,
}: ImprimeEstandoFechado) => {
  const [estadoDialogo, setEstadoDialogo] = useState(
    mostraBotao == false ? true : false
  );

  const router = useRouter();

  useEffect(() => {
    if (mostraBotao === false && estadoDialogo === false)
      router.push("/dashboard/qualidade/balancom");
  }, [estadoDialogo, mostraBotao, router]);

  return (
    <>
      {mostraBotao !== false && (
        <Button
          type="button"
          size="icon"
          disabled={estadoDialogo}
          onClick={() => setEstadoDialogo(true)}
          className="relative flex items-center justify-center cursor-pointer group"
        >
          <Printer />
        </Button>
      )}

      {estadoDialogo && (
        <DialogoImprimeBm
          estadoDialogo={estadoDialogo}
          setEstadoDialogo={setEstadoDialogo}
          op={op}
          idBm={idBm}
        />
      )}
    </>
  );
};

export default ImprimeEstandoFechado;
