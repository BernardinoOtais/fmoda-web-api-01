"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { OpDatasNovoPlanemanetoSchema } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon, ListRestart } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseDate } from "@/lib/my-utils";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

interface InsereDataEQuantidadeProps {
  defaultDate?: Date;
  defaulQtt?: number;
  n?: number;
  op: number;
  variavelD: "u_datafor" | "u_datacam";
  variavelQ: "u_camqtt" | "u_dfqtt";
  resetDados: () => void;
}

type FormData = z.output<typeof OpDatasNovoPlanemanetoSchema>;

const InsereDataEQuantidade = ({
  defaultDate = new Date(),
  defaulQtt = 0,
  n,
  op,
  variavelD,
  variavelQ,
  resetDados,
}: InsereDataEQuantidadeProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { startMonth, endMonth } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    return {
      startMonth: new Date(currentYear, 0), // January of current year
      endMonth: new Date(currentYear + 1, 11), // December of next year
    };
  }, []);

  const [recebeeDadosPai, setRecebeeDadosPai] = useState(0);

  const [open, setOpen] = useState(false);

  const [qttNoComponent, setQttNoComponent] = useState(defaulQtt);

  const [dataNoComponent, setDataNoComponent] = useState(defaultDate);

  const [erro, setErro] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(OpDatasNovoPlanemanetoSchema) as Resolver<FormData>,
    defaultValues: {
      date: dataNoComponent,
      qtt: qttNoComponent,
      n,
    },
  });

  useEffect(() => {
    const dataRecebida = format(defaultDate, "dd/MM/yyyy");
    const dataJaNoComponente = format(dataNoComponent, "dd/MM/yyyy");

    if (recebeeDadosPai !== 0) return;

    if (!n && defaulQtt === 0) return;

    form.setValue("n", n);
    if (dataJaNoComponente !== dataRecebida) {
      setDataNoComponent(defaultDate);
      form.setValue("date", defaultDate);
    }
    if (qttNoComponent !== defaulQtt) {
      setQttNoComponent(defaulQtt);
      form.setValue("qtt", defaulQtt);
    }
  }, [
    dataNoComponent,
    defaulQtt,
    defaultDate,
    form,
    n,
    qttNoComponent,
    recebeeDadosPai,
  ]);

  const { reset } = form;

  const handleOpenChange = (val: boolean) => setOpen(val);

  const { mutate: patchPlaneamento } = useMutation(
    trpc.planeamento.patchPlaneamentoDataEQttDb.mutationOptions({
      onMutate: async (valor) => {
        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        );
        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op }),
          (old) => {
            if (!old || !Array.isArray(old)) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;
              return {
                ...opDados,
                camioes:
                  variavelD === "u_datacam"
                    ? opDados.camioes.map((c) =>
                        c.n === valor.nTipo
                          ? {
                              n: valor.nTipo,
                              dataIn: dataNoComponent,
                              valor: valor.qtt,
                            }
                          : c
                      )
                    : opDados.camioes,
                envios:
                  variavelD === "u_datafor"
                    ? opDados.camioes.map((c) =>
                        c.n === valor.nTipo
                          ? {
                              n: valor.nTipo,
                              dataIn: dataNoComponent,
                              valor: valor.qtt,
                            }
                          : c
                      )
                    : opDados.camioes,
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Planeamento Iserido com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Error ao eliminar Planeamento...");

        if (
          context?.previousData &&
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        ) {
          queryClient.setQueryData(
            trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op }),
            context.previousData
          );
        }
      },
      onSettled: () => {
        reset();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  const { mutate: novaData } = useMutation(
    trpc.planeamento.postDePlaneamentoDataEQttDb.mutationOptions({
      onMutate: async (valor) => {
        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        );
        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op }),
          (old) => {
            if (!old || !Array.isArray(old)) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;
              return {
                ...opDados,
                camioes:
                  variavelD === "u_datacam"
                    ? [
                        ...opDados.camioes,
                        {
                          n: 100,
                          dataIn: valor.data as Date, // ensure it's a Date
                          valor: valor.qtt,
                        },
                      ].sort((a, b) => a.dataIn.getTime() - b.dataIn.getTime())
                    : opDados.camioes,
                envios:
                  variavelD === "u_datafor"
                    ? [
                        ...opDados.envios,
                        {
                          n: 100,
                          dataIn: valor.data as Date, // ensure it's a Date
                          valor: valor.qtt,
                        },
                      ].sort((a, b) => a.dataIn.getTime() - b.dataIn.getTime())
                    : opDados.envios,
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Planeamento Iserido com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Error ao eliminar Planeamento...");

        if (
          context?.previousData &&
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        ) {
          queryClient.setQueryData(
            trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op }),
            context.previousData
          );
        }
      },
      onSettled: () => {
        reset();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  const handleSubmit = (values: FormData) => {
    if (!n)
      novaData({
        op,
        tipoD: variavelD,
        tipoQ: variavelQ,
        data: values.date,
        qtt: values.qtt,
      });
    else
      patchPlaneamento({
        op,
        tipoD: variavelD,
        tipoQ: variavelQ,
        nTipo: n,
        data: values.date,
        qtt: values.qtt,
      });

    resetDados();
    const newDate = new Date(); // ⬅️ Creates a NEW Date reference every time
    reset({ date: newDate, qtt: 0, n: undefined });
    setDataNoComponent(newDate); // ⬅️ Sets component state with the NEW Date reference
    setQttNoComponent(0);
    setErro(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-3 p-3 border rounded-md items-end"
      >
        {/* ✅ Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col relative">
              <FormLabel className="text-xs">Data</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="date"
                    placeholder="dd/mm/yyyy"
                    value={format(dataNoComponent, "dd/MM/yyyy")}
                    className={cn(
                      "bg-background pr-10",
                      erro &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    onChange={(e) => {
                      setErro(false);
                      const parsed = parseDate(e.target.value);
                      if (parsed) {
                        field.onChange(parsed);
                        setDataNoComponent(parsed);
                        setRecebeeDadosPai(1);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setErro(false);
                        setOpen(true);
                      }
                    }}
                  />
                  <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="ghost"
                        type="button"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                        <span className="sr-only">Selecionar data</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        month={dataNoComponent}
                        onMonthChange={setDataNoComponent}
                        onSelect={(selected) => {
                          if (selected) {
                            setErro(false);
                            field.onChange(selected);
                            setDataNoComponent(selected);
                            setRecebeeDadosPai(1);
                            setOpen(false);
                          }
                        }}
                        locale={pt}
                        startMonth={startMonth}
                        endMonth={endMonth}
                        disabled={false} // 🔹 IMPROVEMENT 9: Using memoized function
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* ✅ Quantity Field */}
        <FormField
          control={form.control}
          name="qtt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xs">Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={qttNoComponent}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const numValue = v ? parseInt(v, 10) : 0;
                    setQttNoComponent(numValue);
                    setRecebeeDadosPai(1);
                    field.onChange(numValue);
                  }}
                  className="w-24 text-center"
                  placeholder="Qtd"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col items-end space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="date-picker"
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => {
                  resetDados();
                  const newDate = new Date(); // ⬅️ Creates a NEW Date reference every time
                  reset({ date: newDate, qtt: 0, n: undefined });
                  setDataNoComponent(newDate); // ⬅️ Sets component state with the NEW Date reference
                  setQttNoComponent(0);
                  setErro(false);
                  setRecebeeDadosPai(0);
                }}
              >
                <ListRestart className="size-3.5" />
                <span className="sr-only">Selecionar data</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset...</p>
            </TooltipContent>
          </Tooltip>

          {/* ✅ Submit Button */}
          <Button type="submit">Adicionar</Button>
        </div>
      </form>
    </Form>
  );
};

export default InsereDataEQuantidade;
