"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostItensAcessoriosSchema,
  PostItensAcessoriosSchemaDto,
} from "@repo/tipos/embarques_configurar";
import { useMutation, useQueryClient } from "@repo/trpc";
import { Loader2, MinusCircle, PlusCircle } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

type FormCriaItensProps = {
  idiomas: {
    idIdioma: number;
    nomeIdioma: string;
  }[];
};

const FormCriaItens = ({ idiomas }: FormCriaItensProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [botaoIsloading, setBotaoIsloading] = useState(false);

  const form = useForm<PostItensAcessoriosSchemaDto>({
    resolver: zodResolver(PostItensAcessoriosSchema),
    defaultValues: {
      itens: [
        {
          Descricao: "",
          idiomas: [{ idIdioma: 2, descItem: "" }],
        },
      ],
    },
  });

  const { fields, append, replace, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const appendItem = useCallback(
    (desc: string, idIdioma: number, descItem: string) => {
      append({ Descricao: desc, idiomas: [{ idIdioma, descItem: descItem }] });
    },
    [append]
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const fazCtrlMaisVNoImputfieldSeleccionado =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      if (fazCtrlMaisVNoImputfieldSeleccionado) return;

      event.preventDefault();
      const clipboardText: string = event.clipboardData?.getData("text") || "";

      if (!clipboardText) {
        toast.info(`Ctrl + v`, {
          description: "Nada Copiado...",
        });

        return;
      }

      const rows = clipboardText
        .split("\n")
        .map((row) => {
          // Auto-detect delimiter: Tabs ("\t"), Semicolons (";"), or Commas (",")
          const delimiter = row.includes("\t")
            ? "\t"
            : row.includes(";")
              ? ";"
              : ",";

          return row.split(delimiter).map((cell) => cell.trim());
        })
        .filter((row) => row.length > 0); // Remove empty rows

      const rowsLength = rows.length;

      if (rowsLength === 0) {
        toast.error(`Ctrl + v`, {
          description: "Formato não suportado...",
        });
        return;
      }

      const dataToInsert = rows.map((row) => ({
        Descricao: row[0],
        idiomas: [
          { idIdioma: 2, descItem: row.length >= 2 && row[1] ? row[1] : "" },
        ],
      }));

      console.log("form Inserido: ", dataToInsert);

      replace(dataToInsert);
      // Perform any action with the pasted content
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [replace]);

  const insiroItens = useMutation(
    trpc.embarquesConfigurar.insiroItens.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.embarquesConfigurar.getDestinosDisponiveis.queryOptions()
        );

        toast.success(`Intens Inseridos...`, {
          description: "Sucesso",
        });
      },
      onError: (_error) => {
        toast.error("Erro inesperado ao alterar estado do item:", {
          description:
            _error instanceof Error ? _error.message : "Erro desconhecido",
        });
      },
      onSettled: () => {
        setBotaoIsloading(false);
        form.reset();
      },
    })
  );
  async function onSubmit(values: PostItensAcessoriosSchemaDto) {
    setBotaoIsloading(true);
    /// console.log("Os tais valores : ", values);
    if (values.itens.length === 0) {
      form.reset();
      setBotaoIsloading(false);
      return;
    }
    insiroItens.mutate(values);
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Button
            type="button"
            size="icon"
            className="ml-auto flex items-center"
            onClick={() => appendItem("", 2, "")}
          >
            <PlusCircle size={18} />
          </Button>
          <Table className="">
            <TableCaption>Itens a inserir...</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold">
                  Item PT
                </TableHead>
                <TableHead className="w-20 text-center font-semibold">
                  Lingua
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Item Traduzido
                </TableHead>
                <TableHead className="w-28 text-center font-semibold">
                  Apaga Linha
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, itemIndex) => (
                <TableRow
                  key={item.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  {/* Description Input */}
                  <TableCell className="">
                    <FormField
                      control={form.control}
                      name={`itens.${itemIndex}.Descricao`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              className="border-none"
                              placeholder="Nome em Pt..."
                              {...field}
                            />
                          </FormControl>
                          <div className="h-5">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell colSpan={2} className="m-0 p-0">
                    <Table>
                      <TableBody>
                        {item.idiomas?.map((_, indice) => (
                          <TableRow key={indice}>
                            <TableCell className="w-20 align-top">
                              <Select
                                value={
                                  form
                                    .watch(
                                      `itens.${itemIndex}.idiomas.${indice}.idIdioma`
                                    )
                                    ?.toString() || "2"
                                }
                                onValueChange={(value) => {
                                  form.setValue(
                                    `itens.${itemIndex}.idiomas.${indice}.idIdioma`,
                                    Number(value)
                                  );
                                }}
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue placeholder="Selecione um idioma" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Idiomas</SelectLabel>
                                    {idiomas.map((idioma) => (
                                      <SelectItem
                                        key={idioma.idIdioma}
                                        value={idioma.idIdioma.toString()}
                                      >
                                        {idioma.nomeIdioma}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="">
                              <FormField
                                control={form.control}
                                name={`itens.${itemIndex}.idiomas.${indice}.descItem`}
                                render={({ field }) => (
                                  <FormItem className="space-y-0">
                                    <FormControl>
                                      <Input
                                        className="border-none"
                                        placeholder="Nome em Fr..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <div className="h-5">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell className="text-center align-top">
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => remove(itemIndex)}
                    >
                      <MinusCircle size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button type="submit" className="ml-auto flex items-center">
            {botaoIsloading && <Loader2 className="animate-spin" />} Inserir
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default FormCriaItens;
