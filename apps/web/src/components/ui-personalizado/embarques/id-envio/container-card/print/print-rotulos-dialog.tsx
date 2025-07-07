import { ContainerSchemaDto } from "@repo/tipos/embarques_idenvio";
import { Stamp } from "lucide-react";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import PrintRotulosGetDados from "./print-rotulos-get-dados";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PrintRotulosDialogProp = {
  container: ContainerSchemaDto;
  idEnvio: number;
  idContainer: number;
};
/*
"h-[507px] w-[360px]  sm:h-[570px] sm:w-[404px]  md:h-[632px] md:w-[448]  lg:h-[694px] lg:w-[492px]  xl:h-[756px] xl:w-[536px]  2xl:h-[2538px] 2xl:w-[1800px] "

bg-white sm:bg-red-400 md:bg-blue-300 lg:bg-green-200 xl:bg-pink-600 2xl:bg-gray-600
*/
const PrintRotulosDialog = ({
  container,
  idEnvio,
  idContainer,
}: PrintRotulosDialogProp) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFunction = useReactToPrint({
    contentRef,
    documentTitle: "Rótulos",
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          title="Imprime Rótulos..."
          className="absolute right-12 bottom-2 cursor-pointer"
        >
          <Stamp />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white sm:bg-red-400 md:bg-blue-300 lg:bg-green-200 xl:bg-pink-600 2xl:bg-gray-600">
        <DialogHeader>
          <DialogTitle>Rótulos</DialogTitle>
          <DialogDescription>{`Id: ${idContainer}`}</DialogDescription>
        </DialogHeader>
        <PrintRotulosGetDados
          idEnvio={idEnvio}
          idContainer={idContainer}
          contentRef={contentRef}
          container={container}
        />
        <DialogFooter>
          <Button onClick={() => reactToPrintFunction()}>Imprime</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintRotulosDialog;

//      <AlertDialogContent className="h-[50vw] w-[50vw]">
//  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
