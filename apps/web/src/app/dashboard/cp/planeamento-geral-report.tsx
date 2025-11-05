"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@repo/trpc";
import { Loader2 } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReportViewer from "@/components/ui-personalizado/meus-components/report-viewer";

const reportSchema = z.object({
  format: z.enum(["PDF", "EXCELOPENXML"]),
  forPlan: z.string().optional(),
  op: z.string().optional(),
  po: z.string().optional(),
});

type ReportParams = z.infer<typeof reportSchema>;

async function fetchReport(params: ReportParams): Promise<Blob> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const response = await fetch(
    `/api/report/planeamento?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) throw new Error("Erro ao gerar relatório");
  return response.blob();
}

export default function PlaneamentoGeralReport() {
  const [ficheiro, setficheiro] = useState<string | null>(null);

  const form = useForm<ReportParams>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      format: "PDF",
      forPlan: "",
      op: "",
      po: "",
    },
    mode: "onChange",
  });

  const params = form.watch();

  useEffect(() => {
    setficheiro(null);
  }, [params.forPlan, params.op, params.po, params.format]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["report-planeamento", params],
    queryFn: () => fetchReport(params),
    enabled: false,
    retry: 1,
  });

  useEffect(() => {
    if (!data) return;
    const url = URL.createObjectURL(data);
    setficheiro(url);
    return () => URL.revokeObjectURL(url);
  }, [data]);

  const onSubmit = async () => {
    await refetch();
  };

  return (
    <div className="flex flex-col h-full p-1 w-full items-center space-y-2">
      <Card className=" shadow-md flex-shrink-0 p-1 w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex text-center  w-full gap-2 mx-auto">
            Rapport - Fournisseurs Général
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className=" space-y-2 flex-col">
              {/* 🆕 Radio group for format */}

              <FormField
                control={form.control}
                name="forPlan"
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
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-1">
                          <FormControl>
                            <RadioGroupItem value="PDF" id="r-pdf" />
                          </FormControl>
                          <FormLabel htmlFor="r-pdf">PDF</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-1">
                          <FormControl>
                            <RadioGroupItem value="EXCELOPENXML" id="r-excel" />
                          </FormControl>
                          <FormLabel htmlFor="r-excel">Excel</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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

      <div className="w-full flex-1 min-h-0 ">
        {ficheiro ? (
          <ReportViewer fileUrl={ficheiro} format={params.format} />
        ) : (
          <p className="text-center">...</p>
        )}
      </div>
    </div>
  );
}
