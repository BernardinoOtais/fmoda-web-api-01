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
import { useIsMobile } from "@/hooks/use-mobile";

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

  if (!response.ok) throw new Error("Erreur lors de la génération du rapport");
  return response.blob();
}

export default function RapportFournisseursGeneral() {
  const [fichier, setFichier] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
    setFichier(null);
  }, [params.forPlan, params.op, params.po, params.format]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "rapport-fournisseurs-general",
      params.format,
      params.forPlan,
      params.op,
      params.po,
    ],
    queryFn: () => fetchReport(params),
    enabled: false,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;

    setFichier(null);

    const url = URL.createObjectURL(data);
    const currentFormat = params.format;
    const extension = currentFormat === "EXCELOPENXML" ? "xlsx" : "pdf";
    const nomFichier = `rapport.${extension}`;

    if (!isMobile && currentFormat === "PDF") {
      setFichier(url);
    }

    if (isMobile || currentFormat === "EXCELOPENXML") {
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = nomFichier;
      lien.click();
      URL.revokeObjectURL(url);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data, isMobile, params.format]);

  const onSubmit = async () => {
    await refetch();
  };

  return (
    <div className="flex flex-col h-full p-1 w-full items-center space-y-2">
      <Card className="shadow-md flex-shrink-0 p-1 w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex text-center w-full gap-2 mx-auto">
            Rapport – Fournisseurs Général
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-2 flex-col">
              <FormField
                control={form.control}
                name="forPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex : Hanadil"
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
                  "Générer le rapport"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="w-full flex-1 min-h-0">
        {fichier ? (
          <>
            <iframe
              src={params.format === "PDF" && !isMobile ? fichier : undefined}
              className={`w-full h-full transition-opacity duration-200 ${
                params.format === "PDF" && !isMobile
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              style={{ border: "none" }}
              title="PDF Report"
            />
            {params.format !== "PDF" || isMobile ? (
              <p className="text-center text-muted-foreground">
                {params.format === "EXCELOPENXML"
                  ? "Téléchargement du rapport Excel..."
                  : isMobile
                    ? "Téléchargement du rapport PDF..."
                    : ""}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-center">...</p>
        )}
      </div>
    </div>
  );
}
