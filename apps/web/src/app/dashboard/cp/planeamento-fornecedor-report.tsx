"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@repo/trpc";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PDFViewer } from "@/components/ui-personalizado/meus-components/pdf-viewer";

const reportSchema = z.object({
  dataIni: z.string().min(1, "Data inicial é obrigatória"),
  dataFini: z.string().min(1, "Data final é obrigatória"),
  op: z.string().optional(),
  po: z.string().optional(),
  fornecedor: z.string().optional(),
  fornecedorBo: z.string().optional(),
});

type ReportParams = z.infer<typeof reportSchema>;

async function fetchReport(params: ReportParams): Promise<Blob> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const response = await fetch(
    `/api/report/planeamento-fornecedor?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) throw new Error("Erro ao gerar relatório");
  return response.blob();
}

const PlaneamentoFornecedorReport = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const form = useForm<ReportParams>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      dataIni: "",
      dataFini: "",
      fornecedor: "",
      fornecedorBo: "",
      op: "",
      po: "",
    },
    mode: "onChange",
  });

  const params = form.watch();

  useEffect(() => {
    setPdfUrl(null);
  }, [
    params.dataIni,
    params.dataFini,
    params.fornecedor,
    params.op,
    params.po,
  ]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["report-planeamento", params],
    queryFn: () => fetchReport(params),
    enabled: false,
    retry: 1,
  });

  useEffect(() => {
    if (!data) return;
    const url = URL.createObjectURL(data);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [data]);

  const onSubmit = async () => {
    await refetch();
  };

  return (
    <div className="flex flex-col h-full p-1 w-full items-center">
      <Card className="w-full max-w-max shadow-md flex-shrink-0 p-1">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex text-center  gap-2 mx-auto">
            Rapport - Fournisseur
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex lg:flex-row gap-1 flex-col">
              <FormField
                control={form.control}
                name="dataIni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4" />
                        <Input
                          type="date"
                          className="pl-8"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataFini"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4" />
                        <Input
                          type="date"
                          className="pl-8"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fornecedorBo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Hanadil"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex lg:justify-end justify-center">
              <Button
                className="m-1"
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ...
                  </>
                ) : (
                  "Report"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-1 w-full flex-1 min-h-0 ">
        {pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} />
        ) : (
          <p className="text-center">...</p>
        )}
      </div>
    </div>
  );
};

export default PlaneamentoFornecedorReport;
