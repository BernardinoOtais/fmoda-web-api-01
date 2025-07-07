import { Printer } from "lucide-react";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import PrintPalletGetDados from "./print-pallete-get-dados";

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

type PrintPalletDialogProp = {
  idEnvio: number;
  idContainer: number;
};

const PrintPalletDialog = ({ idEnvio, idContainer }: PrintPalletDialogProp) => {
  //console.log("Print pallet,  h-[1400px]");
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reactToPrintFunction = useReactToPrint({
    contentRef,
    documentTitle: "Packing List",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          title="Imprime Pallet..."
          className="absolute right-2 bottom-2 cursor-pointer"
        >
          <Printer />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-white sm:bg-red-400 md:bg-blue-300 lg:bg-green-200 xl:bg-pink-600 2xl:bg-gray-600">
        <DialogHeader>
          <DialogTitle>Packing List</DialogTitle>
          <DialogDescription>{`Id: ${idContainer}`}</DialogDescription>
        </DialogHeader>
        <PrintPalletGetDados
          idEnvio={idEnvio}
          idContainer={idContainer}
          contentRef={contentRef}
        />
        <DialogFooter>
          <Button onClick={() => reactToPrintFunction()}>Imprime</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintPalletDialog;

//      <AlertDialogContent className="h-[50vw] w-[50vw]">
