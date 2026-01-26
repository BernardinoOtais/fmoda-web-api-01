"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostLoteDto,
  PostLoteSchema,
  QuantidadesDto,
} from "@repo/tipos/planeamento/lotes";
import { useMutation, useQueryClient } from "@repo/trpc";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type NovoPackProps = {
  textoBotao: string;
  total: QuantidadesDto;
  ref: string;
  bostamp: string;
  op: number;
  numeroPecaCaixa: number;
  qttTamanhosAJuntar: number;
};

const NovoPack = ({
  textoBotao,
  total,
  ref,
  bostamp,
  op,
  numeroPecaCaixa,
  qttTamanhosAJuntar,
}: NovoPackProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nLotesTotalRef = useRef<HTMLInputElement>(null);

  const totalCorrecto = total
    .filter((t) => t.qtt !== 0)
    .map((t) => ({ ...t, qtt: 1 }));

  const form = useForm<PostLoteDto>({
    resolver: zodResolver(PostLoteSchema),
    defaultValues: {
      bostamp,
      ref,
      nLotesCaixa: 0,
      nLotesTotal: 0,
      lotes: totalCorrecto || [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "lotes",
  });

  const lotesValues = form.watch("lotes");

  const totalLinha = lotesValues.reduce(
    (acc, lote) => acc + (lote?.qtt || 0),
    0,
  );

  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        nLotesTotalRef.current?.focus();
      }, 0);
    }
  }, [dialogOpen]);

  const { mutate } = useMutation(
    trpc.planeamentoLotes.postOpLotes.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.planeamentoLotes.getOpLotesDist.queryKey({
            Obrano: op,
            CaseCapacity: numeroPecaCaixa,
            MaxSizesPerCase: qttTamanhosAJuntar,
          }),
        });
        form.reset({
          bostamp,
          ref,
          nLotesCaixa: 0,
          nLotesTotal: 0,
          lotes: totalCorrecto || [],
        });
      },
    }),
  );

  const onSubmit = (data: PostLoteDto) => {
    console.log("SUBMIT:", data);
    mutate(data);
    setDialogOpen(false);
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      form.reset({
        bostamp,
        ref,
        nLotesCaixa: 0,
        nLotesTotal: 0,
        lotes: totalCorrecto || [],
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-center my-1 py-2 hover:bg-muted/70 cursor-pointer"
        >
          {textoBotao}
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit max-w-none">
        <DialogHeader>
          <DialogTitle>{`Criar Packs para ${textoBotao}`}</DialogTitle>
          <DialogDescription>Criar packs</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <Table className="border border-border rounded-md border-collapse max-w-125 mx-auto ">
              <TableHeader className="bg-muted">
                <TableRow>
                  {fields.map((field) => (
                    <TableHead
                      key={field.tam}
                      className="border border-border text-center min-w-12 max-w-25 h-7 "
                    >
                      {field.tam.split(" - ")[0]}
                    </TableHead>
                  ))}
                  <TableHead className="border border-border text-center font-semibold min-w-12 max-w-25 h-7 ">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {fields.map((field, index) => (
                    <TableCell
                      key={field.tam}
                      className="border border-border text-center min-w-12 max-w-25 h-2 p-0"
                    >
                      <FormField
                        control={form.control}
                        name={`lotes.${index}.qtt`}
                        render={({ field: qttField }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                className="text-center"
                                {...qttField}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  qttField.onChange(isNaN(val) ? 0 : val);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="border border-border text-center min-w-12 max-w-25 h-2 p-0 font-semibold">
                    {totalLinha}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex gap-4 justify-center mt-4">
              <FormField
                control={form.control}
                name="nLotesTotal"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-center font-medium mb-1">
                      Total de Lotes
                    </label>
                    <FormControl>
                      <Input
                        {...field}
                        ref={nLotesTotalRef}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val); // fallback to 0 if NaN
                        }}
                        className="text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nLotesCaixa"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-center font-medium mb-1">
                      Nº Lotes por Caixa
                    </label>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val); // fallback to 0 if NaN
                        }}
                        className="text-center"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="cursor-pointer">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPack;
