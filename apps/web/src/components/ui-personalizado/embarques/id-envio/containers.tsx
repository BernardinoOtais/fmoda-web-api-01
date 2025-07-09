"use client";
import {
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { ListaContainersDto } from "@repo/tipos/embarques_idenvio";
import { useQueryClient } from "@repo/trpc";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ContainerCard from "./container-card";
import { useReordenaContainer } from "./container-card/hook/use-reordena-container";

import { useTRPC } from "@/trpc/client";

type ContainersProps = {
  listaContainersDto: ListaContainersDto;
  idEnvio: number;
  chave: IdNumeroInteiroNaoNegativoDto;
};

const DndContextWithNoSSR = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  { ssr: false }
);

const Containers = ({
  listaContainersDto,
  idEnvio,
  chave,
}: ContainersProps) => {
  const mutation = useReordenaContainer(chave);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const lista = queryClient.getQueryData(
    trpc.embarquesIdEnvio.getContainers.queryKey(chave)
  )?.containers;

  const codigoTRPC = trpc.embarquesIdEnvio.getContainers.queryKey(chave);

  const [items, setItems] = useState(lista ?? []);

  const [scroll, setScroll] = useState(true);

  useEffect(() => {
    setItems(lista ?? []);
  }, [lista]);

  useEffect(() => {
    if (
      listaContainersDto &&
      items.length < listaContainersDto.length &&
      !scroll
    ) {
      setScroll(true);
    }
  }, [listaContainersDto, items, scroll]);

  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastItemRef.current && scroll) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [items, scroll]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let updatedItemsFinal: ListaContainersDto = [];

      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex(
          (item) => item.idContainer === active.id
        );
        const newIndex = prevItems.findIndex(
          (item) => item.idContainer === over.id
        );

        if (oldIndex === -1 || newIndex === -1) {
          return prevItems;
        }

        const updatedItems = [...prevItems];
        const [movedItem] = updatedItems.splice(oldIndex, 1); // Remove the item
        if (movedItem) {
          updatedItems.splice(newIndex, 0, movedItem); // Insert the item at the new index
        }

        // Assign correct `ordem` to all items
        const dadosComOrdemCorrecta = updatedItems.map((item, index) => ({
          ...item,
          ordem: index + 1,
        }));

        // Group by `idTipoContainer`
        const dadosAgrupadosPorTipo: Record<number, ListaContainersDto> = {};
        dadosComOrdemCorrecta.forEach((container) => {
          const { idTipoContainer } = container;
          (dadosAgrupadosPorTipo[idTipoContainer] ??= []).push(container);
        });

        // Assign `nContainer` within each group
        const nContainerComAOrdemCorrect = Object.values(
          dadosAgrupadosPorTipo
        ).flatMap((grupo) =>
          grupo.map((container, index) => ({
            idContainer: container.idContainer,
            nContainer: index + 1, // Assign sequential nContainer
          }))
        );

        // Merge updated `nContainer` back into items
        const newDadosComOrdemCorrecta = dadosComOrdemCorrecta.map((item) => {
          const updatedContainer = nContainerComAOrdemCorrect.find(
            (nItem) => nItem.idContainer === item.idContainer
          );
          return {
            ...item,
            nContainer: updatedContainer
              ? updatedContainer.nContainer
              : item.nContainer, // Keep existing nContainer if not updated
          };
        });

        updatedItemsFinal = newDadosComOrdemCorrecta;

        return updatedItemsFinal;
      });

      //O tais post Post
      const dadosParaPost = updatedItemsFinal.map((item) => ({
        id: item.idContainer,
        ordem: item.ordem,
      }));

      mutation.mutate(
        { idEnvio, idOrdem: dadosParaPost },
        {
          onError: (_err, _vars, context) => {
            toast.error("Erro ao ordenar a lista...");
            if (context?.previousContainers) {
              queryClient.setQueryData(codigoTRPC, context.previousContainers);
              setItems(context?.previousContainers.containers);
            }
          },
          onSuccess: () => {
            toast.success("Lista ordenada...");
          },
        }
      );
    }
  };

  return (
    <DndContextWithNoSSR
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items.map((item) => item.idContainer)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((container, index) => (
          <ContainerCard
            key={container.idContainer}
            container={container}
            idEnvio={idEnvio}
            referencia={index === items.length - 1 ? lastItemRef : null}
            setScroll={setScroll}
          />
        ))}
      </SortableContext>
    </DndContextWithNoSSR>
  );
};

export default Containers;
