import { zodResolver } from "@hookform/resolvers/zod";
import { AutocompleteStringDto } from "@repo/tipos/comuns";
import {
  CsvRowsRfidDto,
  PostRfidFinalDto,
  PostRfidFinalSchema,
  RfidDadosDto,
} from "@repo/tipos/rfid";
import { useMutation, useQuery } from "@repo/trpc";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutoCompleteFormFieldString } from "@/components/ui-personalizado/meus-components/AutoCompleteFormFieldString";
import useDebounce from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";

type InsereCsvFormEvoluidoProps = {
  pedidos: string[];
  linhasCsv: CsvRowsRfidDto;
  resetFileInput: () => void;
};

const InsereCsvFormEvoluido = ({
  pedidos,
  linhasCsv,
  resetFileInput,
}: InsereCsvFormEvoluidoProps) => {
  const [bDisabled, setBDisabled] = useState(true);
  const [botaoAlteraIsloading, setBotaoAlteraIsloading] = useState(false);
  const pedidosParaGet = pedidos.map((pedido) => ({ pedido }));
  const trpc = useTRPC();

  const mutation = useMutation({
    mutationFn: async (values: PostRfidFinalDto) => {
      const res = await fetch("/api/rfid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar RFIDs");
      }

      return res.json();
    },
  });

  const resetAll = () => {
    // Reset form with fresh default values based on current props
    form.reset({
      rows: linhasCsv,
      correspodencia: pedidos.map((pedido) => ({
        order_id: pedido,
      })),
    });

    // Reset state flags
    setBDisabled(true);
    setBotaoAlteraIsloading(false);

    // Reset file input
    resetFileInput();
  };

  const form = useForm<PostRfidFinalDto>({
    resolver: zodResolver(PostRfidFinalSchema),
    defaultValues: {
      rows: linhasCsv,
      correspodencia: pedidosParaGet.map((p) => ({
        order_id: p.pedido,
      })),
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setBDisabled(true);
      const valoreDoFormVerificados = PostRfidFinalSchema.safeParse(values);
      if (!valoreDoFormVerificados.success) {
        return;
      }
      setBDisabled(false);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const { data, isLoading, error } = useQuery({
    ...trpc.rfid.getOPRfid.queryOptions(pedidosParaGet),
    // enabled: PostRfidFinalSchema.safeParse(pedidosParaGet).success,
  });

  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  async function onSubmit(values: PostRfidFinalDto) {
    setBDisabled(true);
    setBotaoAlteraIsloading(true);
    try {
      const resultado = await mutation.mutateAsync(values);
      if (!resultado.success) {
        toast.error(`Erro ao alterar Envio...`, {
          description: resultado.error,
        });
        form.reset();
      } else {
        toast.info(`Alterado correctament...`, {
          description: "Sucesso",
        });
        //Voltar estado original
      }
    } catch (error) {
      console.error("Erro inesperado ao alterar envio:", error);
      toast.error("Erro inesperado ao alterar envio", {
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setBotaoAlteraIsloading(false);
      setBDisabled(true);

      resetAll();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {data?.map((pedido, index) => {
          const valorOp = form.watch(`correspodencia.${index}.obrano`);
          const { dados } = pedido;
          const opsDispiniveis = dados.map((op) => ({
            value: `${op.obrano}`,
            label: `${op.obrano}`,
          }));
          return (
            <Card key={pedido.pedido} className="mb-1">
              <CardHeader>
                <CardTitle>
                  <p>Pedido: {pedido.pedido}</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dados.length === 0 ? (
                  <PedidoManual form={form} index={index} valorOp={valorOp} />
                ) : (
                  <PediddoAutomatico
                    form={form}
                    name={`correspodencia.${index}.obrano`}
                    opsDispiniveis={opsDispiniveis}
                    valorOp={valorOp}
                    dados={dados}
                    fornecedorDaOp={`correspodencia.${index}.idFornecedor`}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
        <div className="mt-2 flex justify-end">
          <Button
            disabled={bDisabled}
            type="submit"
            className="relative flex items-center justify-center"
          >
            {botaoAlteraIsloading && (
              <Loader2 className="absolute animate-spin w-10 h-10" />
            )}
            <span>Inserir dados</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

const PedidoManual = ({
  form,
  index,
  valorOp,
}: {
  form: UseFormReturn<PostRfidFinalDto>;
  index: number;
  valorOp?: number;
}) => {
  const trpc = useTRPC();
  const [input, setInput] = useState("");

  const debouncedValue = useDebounce(input, 500); // 500ms debounce

  const { data, isLoading, error } = useQuery({
    ...trpc.rfid.getOPRfid.queryOptions([{ pedido: debouncedValue }]),
    enabled: !!debouncedValue,
  });

  return (
    <div className="space-y-4 max-w-md">
      <Input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && (
        <p className="text-sm text-destructive">Error loading results</p>
      )}

      {data &&
        data &&
        !isLoading &&
        !error &&
        data &&
        data[0]?.dados &&
        data[0].dados.length > 0 && (
          <PediddoAutomatico
            form={form}
            name={`correspodencia.${index}.obrano`}
            opsDispiniveis={data[0]?.dados?.map((op) => ({
              value: `${op.obrano}`,
              label: `${op.obrano}`,
            }))}
            valorOp={valorOp}
            dados={data[0]?.dados}
            fornecedorDaOp={`correspodencia.${index}.idFornecedor`}
          />
        )}
    </div>
  );
};

const PediddoAutomatico = ({
  form,
  name,
  opsDispiniveis,
  valorOp,
  dados,
  fornecedorDaOp,
}: {
  form: UseFormReturn<PostRfidFinalDto>;
  name: `correspodencia.${number}.obrano`;
  opsDispiniveis: AutocompleteStringDto[];
  valorOp?: number;
  dados: RfidDadosDto;
  fornecedorDaOp: `correspodencia.${number}.idFornecedor`;
}) => {
  return (
    <>
      <AutoCompleteFormFieldString
        form={form}
        name={name}
        options={opsDispiniveis}
        placeholder="Op..."
        largura="w-[150px]"
        mostraErro={false}
        disable={false}
      />
      {valorOp && (
        <FornecedorParaEstaOP
          op={valorOp}
          dados={dados}
          form={form}
          fornecedorDaOp={fornecedorDaOp}
        />
      )}
    </>
  );
};

const FornecedorParaEstaOP = ({
  op,
  dados,
  form,
  fornecedorDaOp,
}: {
  op: number;
  dados: RfidDadosDto;
  form: UseFormReturn<PostRfidFinalDto>;
  fornecedorDaOp: `correspodencia.${number}.idFornecedor`;
}) => {
  const linha = dados.find((dado) => dado.obrano * 1 === op * 1);
  const fornecedores = useMemo(() => {
    return linha?.fornecedores ?? [];
  }, [linha]);

  //para o caso da op mudar reset ao campo fornecedor...
  useEffect(() => {
    const current = form.getValues(fornecedorDaOp);

    if (fornecedores.length === 1 && fornecedores[0]) {
      if (current !== fornecedores[0].value) {
        form.setValue(fornecedorDaOp, fornecedores[0].value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else if (current !== undefined) {
      form.resetField(fornecedorDaOp, {
        defaultValue: undefined,
      });
    }
  }, [fornecedores, fornecedorDaOp, form]);

  // Now it’s safe to return
  if (!linha) {
    return <div>Sem fornecedor...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm">{linha.design}</p>
      <p className="text-sm">{`Cor: ${linha.cor}`}</p>
      {fornecedores.length === 1 && fornecedores[0] ? (
        <div className="text-sm text-muted-foreground">
          {fornecedores[0].label}
        </div>
      ) : (
        <AutoCompleteFormFieldString
          form={form}
          name={fornecedorDaOp}
          options={fornecedores}
          placeholder="Fornecedor..."
          largura="w-[450px]"
          mostraErro={false}
          disable={false}
        />
      )}
    </div>
  );
};

export default InsereCsvFormEvoluido;
