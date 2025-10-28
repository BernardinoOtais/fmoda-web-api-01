import { zodResolver } from "@hookform/resolvers/zod";
import { DataQttSchema } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon, ListRestart, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import { useTRPC } from "@/trpc/client";

// ✅ Zod Schema
const schema = z.object({
  date: z.date(),
  qtt: z.number().min(1, "Quantidade obrigatória"),
});

type FormValues = z.infer<typeof schema>;

type InsereDataQttProps = {
  linhaSeleccionada: DataQttSchema | undefined;
  bostamp: string;
  resetEscolha: () => void;
  op: number;
  tipo: 2 | 3;
};
const InsereDataQtt = ({
  linhaSeleccionada,
  bostamp,
  resetEscolha,
  op,
  tipo,
}: InsereDataQttProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { startMonth, endMonth } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    return {
      startMonth: new Date(currentYear, 0),
      endMonth: new Date(currentYear + 1, 11),
    };
  }, []);

  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      qtt: 0,
    },
    mode: "onChange",
  });

  // 🔄 SIMPLIFIED: Single source of truth from form state
  const currentDate = form.watch("date");
  const currentQtt = form.watch("qtt");
  const { reset } = form;

  useEffect(() => {
    if (linhaSeleccionada) {
      reset({
        date: linhaSeleccionada.data ?? new Date(),
        qtt: linhaSeleccionada.qtt ?? 0,
      });
    }
  }, [linhaSeleccionada, reset]);

  const { mutate: upsert, isPending } = useMutation(
    trpc.planeamento.upsertDataEValor.mutationOptions({
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

              if (tipo === 2) {
                return {
                  ...opDados,
                  dCamioes: !valor.idDataQtt
                    ? [
                        ...opDados.dCamioes,
                        {
                          idDataQtt: 99999,
                          bostamp: valor.bostamp,
                          data: valor.data as Date,
                          qtt: valor.qtt,
                        },
                      ]
                    : opDados.dCamioes.map((d) =>
                        d.idDataQtt === valor.idDataQtt
                          ? {
                              ...d,
                              data: valor.data as Date,
                              qtt: valor.qtt,
                            }
                          : d
                      ),
                };
              }

              if (tipo === 3) {
                return {
                  ...opDados,
                  dFaturas: !valor.idDataQtt
                    ? [
                        ...opDados.dFaturas,
                        {
                          idDataQtt: 99999,
                          bostamp: valor.bostamp,
                          data: valor.data as Date,
                          qtt: valor.qtt,
                        },
                      ]
                    : opDados.dFaturas.map((d) =>
                        d.idDataQtt === valor.idDataQtt
                          ? {
                              ...d,
                              data: valor.data as Date,
                              qtt: valor.qtt,
                            }
                          : d
                      ),
                };
              }

              return opDados;
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
        resetDados();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  const handleSubmit = (values: FormValues) => {
    upsert({
      idDataQtt: linhaSeleccionada?.idDataQtt || null,
      bostamp,
      data: values.date,
      nTipo: tipo,
      qtt: values.qtt,
    });
  };

  // 🔄 SIMPLIFIED: Reset function
  const resetDados = () => {
    resetEscolha();
    form.reset({
      date: new Date(),
      qtt: 0,
    });
  };

  //funcao upsertDataEValor
  const handleOpenChange = (val: boolean) => setOpen(val);
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
            <FormItem className="flex flex-col flex-1">
              <FormLabel className="text-xs">Data</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={handleOpenChange}>
                  <div className="relative">
                    <Input
                      id="date"
                      placeholder="dd/mm/yyyy"
                      value={format(currentDate, "dd/MM/yyyy")}
                      className="bg-background pr-10"
                      onChange={(e) => {
                        const parsed = parseDate(e.target.value);
                        if (parsed) {
                          field.onChange(parsed);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          document.getElementById("date-picker")?.click();

                          setOpen(true);
                        }
                      }}
                    />
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
                  </div>
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
                      month={currentDate}
                      onMonthChange={(date) => field.onChange(date)}
                      onSelect={(selected) => {
                        if (selected) {
                          field.onChange(selected);
                          setOpen(false);
                        }
                      }}
                      locale={pt}
                      startMonth={startMonth}
                      endMonth={endMonth}
                    />
                  </PopoverContent>
                </Popover>
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
                  value={currentQtt || ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    const numValue = v ? parseInt(v, 10) : 0;
                    field.onChange(numValue);
                  }}
                  className="w-24 text-center"
                  placeholder="Qtd"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* ✅ Buttons */}
        <div className="flex flex-col items-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={resetDados}
              >
                <ListRestart className="size-3.5" />
                <span className="sr-only">Reset</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resetar</p>
            </TooltipContent>
          </Tooltip>

          <Button
            size="icon"
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="flex-1 lg:flex-none"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InsereDataQtt;
