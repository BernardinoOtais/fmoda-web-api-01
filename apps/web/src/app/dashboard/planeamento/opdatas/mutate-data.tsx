import { useMutation, useQueryClient } from "@repo/trpc";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

// Format Date → "dd/mm/yyyy"
function formatDate(date: Date | undefined): string {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Parse "dd/mm/yyyy" → Date
function parseDate(value: string): Date | undefined {
  const parts = value.split("/");
  if (parts.length !== 3) return undefined;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? undefined : date;
}

type DataProps = {
  dataOriginal: Date;
  op: number;
  variavel: "u_datafor" | "u_datacam";
  nData: number;
};

const MutateData = ({ dataOriginal, op, variavel, nData }: DataProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [today] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(dataOriginal);
  const [month, setMonth] = useState<Date>(dataOriginal);

  const [raw, setRaw] = useState(formatDate(dataOriginal));

  const [erro, setErro] = useState(false);

  const debouncedValue = useDebounce(raw, 150);

  const [wasManuallyChanged, setWasManuallyChanged] = useState(false);

  // Sync with dataOriginal when it changes
  useEffect(() => {
    setRaw(formatDate(dataOriginal));
    setDate(dataOriginal);
    setMonth(dataOriginal);
    setWasManuallyChanged(false);
    setErro(false);
  }, [dataOriginal]);

  useEffect(() => {
    setErro(false);
  }, [debouncedValue]);

  const { mutate: insiroData, isPending } = useMutation(
    trpc.planeamento.postDeData.mutationOptions({
      onMutate: async (valor) => {
        setErro(false);
        await queryClient.cancelQueries(
          trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
        );

        const previousData = queryClient.getQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op: op })
        );
        queryClient.setQueryData(
          trpc.planeamento.getOpCamioesEnvios.queryKey({ op }),
          (old) => {
            if (!old) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;

              return {
                ...opDados,
                camioes:
                  variavel === "u_datacam"
                    ? opDados.camioes.map((c) =>
                        c.n === nData
                          ? { ...c, dataIn: new Date(valor.data as string) }
                          : c
                      )
                    : opDados.camioes,
                envios:
                  variavel === "u_datafor"
                    ? opDados.envios.map((e) =>
                        e.n === nData
                          ? { ...e, dataIn: new Date(valor.data as string) }
                          : e
                      )
                    : opDados.envios,
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Data inserida com sucesso...");
      },
      onError: (_error, _updatedEnvio, context) => {
        setErro(true);
        toast.error("Não foi possível inserir o Data...");

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
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  useEffect(() => {
    if (!wasManuallyChanged) return;

    const parsed = parseDate(debouncedValue);

    if (!parsed) return;

    // CHANGE 3: Use setTime(0,0,0,0) for accurate date comparison (ignoring time)
    const parsedDateOnly = new Date(parsed);
    parsedDateOnly.setHours(0, 0, 0, 0);

    const originalDateOnly = new Date(dataOriginal);
    originalDateOnly.setHours(0, 0, 0, 0);

    if (originalDateOnly.getTime() === parsedDateOnly.getTime()) return;

    if (erro || isPending) return;
    insiroData({ op, variavel, nData, data: parsed });

    setDate(parsed);
    setMonth(parsed);
  }, [
    dataOriginal,
    debouncedValue,
    erro,
    insiroData,
    isPending,
    nData,
    op,
    variavel,
    wasManuallyChanged,
  ]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Only set the month to 'today' if the currently selected date is not in the current month
      const currentSelectedMonth = date.getMonth();
      const currentSelectedYear = date.getFullYear();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      // If the selected date is not in the current month, navigate to today's month
      if (
        currentSelectedMonth !== todayMonth ||
        currentSelectedYear !== todayYear
      ) {
        setMonth(today);
      } else {
        // Otherwise, stick with the selected date's month
        setMonth(date);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          disabled={isPending}
          placeholder="dd/mm/yyyy"
          value={raw}
          className="bg-background "
          onChange={(e) => {
            setRaw(e.target.value);
            // CHANGE 4: Set wasManuallyChanged immediately on typing
            setWasManuallyChanged(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              setErro(false);
              e.preventDefault();
              setOpen(true);
              setWasManuallyChanged(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
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
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selected) => {
                if (selected) {
                  setWasManuallyChanged(true);
                  setErro(false);
                  setDate(selected);
                  setMonth(selected);
                  setRaw(formatDate(selected));
                  setOpen(false);
                }
              }}
              locale={pt}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MutateData;
