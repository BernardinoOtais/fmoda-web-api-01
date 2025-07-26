"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DadosParaPesquisaComPaginacaoEOrdemDto } from "@repo/tipos/comuns";
import { OpDto, OPschema } from "@repo/tipos/qualidade_balancom";
import { useMutation, useQuery, useSuspenseQuery } from "@repo/trpc";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AbreOuFechaBm from "./abre-ou-fecha-bm";
import DialogoImprimeBm from "./imprime-bm/dialogo-imprime-bm";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type NovoBalancoMassasProps = {
  dadosIniciais: DadosParaPesquisaComPaginacaoEOrdemDto;
};

const NovoBalancoMassas = ({ dadosIniciais }: NovoBalancoMassasProps) => {
  const [estadoDialogo, setEstadoDialogo] = useState(false);
  const trpc = useTRPC();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof OPschema>>({
    resolver: zodResolver(OPschema),
    defaultValues: {
      op: undefined,
    },
  });

  const opValue = form.watch("op");

  const debouncedOp = useDebounce({ op: opValue }, 1250);

  const { data, isLoading, error } = useQuery({
    ...trpc.qualidadeBalancoM.getPrimeiroBmPorOp.queryOptions(debouncedOp),
    enabled: OPschema.safeParse(debouncedOp).success,
  });

  const novoBm = useMutation(
    trpc.qualidadeBalancoM.postNovoBalancoMassas.mutationOptions({
      onSuccess: (_result, variables) => {
        router.push(`/dashboard/qualidade/balancom/${variables.op}`);
      },
      onError: () => {
        toast.error("Erro ao criar novo Balanço de Massas");
        return;
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    })
  );

  useEffect(() => {
    if (error) {
      toast.error("Erro ao get Balanço de Massas", {
        description: String(error.message || "Algo deu errado."),
      });
    }
  }, [error]);

  const onSubmit = async (dataOp: OpDto) => {
    setIsSubmitting(true);
    const estado = error
      ? "Erro..."
      : data === undefined
        ? "..."
        : data === null
          ? "Novo Bm..."
          : data.Bm.fechado
            ? "Print Bm"
            : `Ver Bm`;

    if (estado === "Novo Bm...") {
      novoBm.mutate(dataOp);
      return;
    }
    if (estado === "Ver Bm")
      router.push(`/dashboard/qualidade/balancom/${dataOp.op}`);

    //Teste
    if (estado === "Print Bm") setEstadoDialogo(true);

    setIsSubmitting(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-lg p-2  select-none "
        >
          <FormField
            control={form.control}
            name="op"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="justify-self-center">
                  Balaço de Massas
                </FormLabel>
                <div className="flex space-x-1">
                  <FormControl>
                    <Input
                      className="w-24"
                      placeholder="Op.."
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading || isSubmitting}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    disabled={
                      isLoading || !!error || data === undefined || isSubmitting
                    }
                    className="cursor-pointer"
                  >
                    {isLoading && <Loader2Icon className="animate-spin" />}
                    {error
                      ? "Erro..."
                      : data === undefined
                        ? "..."
                        : data === null
                          ? "Novo Bm..."
                          : data.Bm.fechado
                            ? "Print Bm"
                            : `Ver Bm ${data.op}...`}
                  </Button>
                  {data && (
                    <AbreOuFechaBm
                      dadosIniciais={dadosIniciais}
                      idBm={data.Bm.idBm}
                      estadoInicial={data.Bm.fechado}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {data && data.Bm.fechado && (
        <DialogoImprimeBm
          estadoDialogo={estadoDialogo}
          setEstadoDialogo={setEstadoDialogo}
          op={data.op}
          idBm={data.Bm.idBm}
        />
      )}
    </>
  );
};

export default NovoBalancoMassas;
