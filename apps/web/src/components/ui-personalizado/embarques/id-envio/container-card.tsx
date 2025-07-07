import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContainerDto } from "@repo/tipos/embarques_idenvio";
import { GripHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

import ApagaOpDoContainer from "./container-card/apaga-op-do-container";
import BotaoApagaContainer from "./container-card/botao-apaga-container";
import InputAltura from "./container-card/input-altura";
import InputOp from "./container-card/input-op";
import PrintPalletDialog from "./container-card/print/print-pallet-dialog";
import PrintRotulosDialog from "./container-card/print/print-rotulos-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ContainerCardProps = {
  container: ContainerDto;
  idEnvio: number;
  referencia: React.RefObject<HTMLDivElement | null> | null;
  setScroll: (data: boolean) => void;
};

const ContainerCard = ({
  container,
  idEnvio,
  referencia,
  setScroll,
}: ContainerCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: container.idContainer });

  const naoTemConteudo = container._count.Conteudo === 0;

  const naoTemSubContainers = container._count.other_Container === 0;

  const idContainerTipPallet = 4;

  return (
    <>
      <Card
        key={container.idContainer}
        className={cn(
          "relative ",
          isDragging && "relative z-50 cursor-grab shadow-xl"
        )}
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        {container.idContainerPai && (
          <GripHorizontal
            {...attributes}
            {...listeners}
            className="text-muted-foreground absolute top-2 right-2 size-5 cursor-grab focus:outline-hidden "
          />
        )}

        <CardHeader className="pt-1 pb-0 ">
          <div className="mx-auto">
            <Link
              href={{
                pathname: `/dashboard/embarques/${idEnvio}`,
                query: {
                  nivel: [...new Set([container.idContainer])], // Remove duplicates
                },
              }}
            >
              <CardTitle className="text-center">{`${container.TipoContainer?.Item.Descricao} nº${container.nContainer}`}</CardTitle>
              <CardDescription className="text-center">{`id-${container.idContainer} ordem:${container.ordem}`}</CardDescription>
            </Link>
          </div>
        </CardHeader>
        <CardContent
          ref={referencia}
          className="flex flex-col items-center justify-start md:flex-row md:items-end "
        >
          <div className="flex flex-row gap-1 px-1">
            {container.idTipoContainer === idContainerTipPallet ? (
              <InputAltura
                idEnvio={idEnvio}
                container={container}
                setScroll={setScroll}
              />
            ) : (
              container.idTipoContainer > idContainerTipPallet && (
                <span>{container.TipoContainer?.Item.Descricao}</span>
              )
            )}
            {container.idTipoContainer === idContainerTipPallet && (
              <Separator orientation="vertical" className="h-14 w-[2px]" />
            )}

            {container.idTipoContainer === idContainerTipPallet && (
              <InputOp
                idEnvio={idEnvio}
                container={container}
                setScroll={setScroll}
              />
            )}
          </div>
          <div className="flex grow">
            <div className="mr-auto ">
              {container.idTipoContainer === idContainerTipPallet &&
                container.ContainerOp?.map((op) => (
                  <ApagaOpDoContainer
                    key={op.op}
                    idEnvio={idEnvio}
                    container={container}
                    op={op.op}
                    idContainer={container.idContainer}
                    setScroll={setScroll}
                  />
                ))}
            </div>
          </div>
        </CardContent>
        {naoTemConteudo && naoTemSubContainers ? (
          <BotaoApagaContainer
            idEnvio={idEnvio}
            idPai={container.idContainerPai}
            idContainer={container.idContainer}
            className="absolute right-2 bottom-2"
            setScroll={setScroll}
            nomeContainer={container.TipoContainer?.Item.Descricao || ""}
          />
        ) : (
          container.idTipoContainer < 5 &&
          getContainerComponent(idEnvio, container)
        )}
      </Card>
    </>
  );
};

export default ContainerCard;

const getContainerComponent = (idEnvio: number, container: ContainerDto) => (
  <div className="absolute right-2 bottom-2">
    <PrintPalletDialog idEnvio={idEnvio} idContainer={container.idContainer} />
    <PrintRotulosDialog
      container={container}
      idEnvio={idEnvio}
      idContainer={container.idContainer}
    />
  </div>
);
