"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FloatZeroSchema } from "@repo/tipos/comuns";
import { FornecedorValorDto } from "@repo/tipos/planeamento";
import { useMutation, useQueryClient } from "@repo/trpc";
import { ListRestart, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Form, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";

const supplierFormSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  fee: FloatZeroSchema,
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

type InsereFornecedoresEPrecoProps = {
  linhaSeleccionada: FornecedorValorDto | undefined;
  bostamp: string;
  resetEscolha: () => void;
  op: number;
};

export default function InsereFornecedoresEPreco({
  linhaSeleccionada,
  bostamp,
  resetEscolha,
  op,
}: InsereFornecedoresEPrecoProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      nome: "",
      fee: 0,
    },
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    if (linhaSeleccionada) {
      reset({
        nome: linhaSeleccionada.nome ?? "",
        fee: linhaSeleccionada.valorServico ?? 0,
      });
    }
  }, [linhaSeleccionada, reset]);

  const { mutate: upsert, isPending } = useMutation(
    trpc.planeamento.upsertDescValor.mutationOptions({
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
            if (!old) return old;

            return old.map((opDados) => {
              if (opDados.op !== op) return opDados;

              return {
                ...opDados,
                fornecedorValor: !valor.idValorizado
                  ? [
                      ...opDados.fornecedorValor,
                      {
                        idValorizado: 99999,
                        bostamp: valor.bostamp,
                        nome: valor.nome,
                        valorServico: valor.valorServico as number,
                      },
                    ]
                  : opDados.fornecedorValor.map((f) =>
                      f.idValorizado === valor.idValorizado
                        ? {
                            ...f,
                            nome: valor.nome,
                            valorServico: valor.valorServico as number,
                          }
                        : f
                    ),
              };
            });
          }
        );

        return { previousData };
      },
      onSuccess: () => {
        toast.success("Sucesso..");
      },
      onError: (_error, _updatedEnvio, context) => {
        toast.error("Erro...");

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
        handleReset();
        if (trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })) {
          void queryClient.refetchQueries(
            trpc.planeamento.getOpCamioesEnvios.queryOptions({ op: op })
          );
        }
      },
    })
  );

  //upsertDescValor
  const onSubmit = (values: SupplierFormValues) => {
    upsert({
      idValorizado: linhaSeleccionada?.idValorizado || null,
      bostamp: bostamp,
      nome: values.nome,
      nTipo: 1,
      valorServico: values.fee,
    });
  };

  const handleReset = () => {
    resetEscolha();
    reset({
      nome: "",
      fee: 0,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:w-96 w-full">
        <FieldSet>
          <FieldGroup className="flex flex-col lg:flex-row gap-2 items-center lg:items-end">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <Field className="flex-1 w-full">
                  <FieldLabel htmlFor="nome">Fornecedor</FieldLabel>
                  <FormControl>
                    <Input
                      id="nome"
                      disabled={isPending}
                      placeholder="Fornecedor..."
                      {...field}
                    />
                  </FormControl>
                </Field>
              )}
            />
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <Field className="lg:w-24 w-full">
                  <FieldLabel htmlFor="fee">Valor</FieldLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                </Field>
              )}
            />
            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-1 w-full lg:w-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isPending}
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleReset}
                    className="flex-1 lg:flex-none"
                  >
                    <ListRestart className="size-4" />
                    <span className="sr-only">Reset</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Limpar campos</p>
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
          </FieldGroup>
        </FieldSet>
      </form>
    </Form>
  );
}
