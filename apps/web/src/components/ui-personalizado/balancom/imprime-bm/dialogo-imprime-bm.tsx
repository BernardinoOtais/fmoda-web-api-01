import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import DadosParaImprimir from "./dados-para-imprimir";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogoImprimeBmProps = {
  estadoDialogo: boolean;
  setEstadoDialogo: React.Dispatch<React.SetStateAction<boolean>>;
  op: number;
  idBm: string;
};
const DialogoImprimeBm = ({
  estadoDialogo,
  setEstadoDialogo,
  op,
  idBm,
}: DialogoImprimeBmProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFunction = useReactToPrint({
    contentRef,
    documentTitle: `Relatório da Op: ${op} `,
  });
  return (
    <Dialog open={estadoDialogo} onOpenChange={setEstadoDialogo}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{`Op: ${op}`}</DialogTitle>
          <DialogDescription>{`idBm: ${idBm}`}</DialogDescription>
        </DialogHeader>
        <DadosParaImprimir idBm={idBm} contentRef={contentRef} />
        <DialogFooter>
          <Button onClick={() => reactToPrintFunction()}>Imprime</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogoImprimeBm;
