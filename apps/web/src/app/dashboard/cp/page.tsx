"use client";

import { useQuery } from "@repo/trpc";
import { CalendarIcon, FileTextIcon, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReportParams {
  dataIni: string;
  dataFini: string;
  op: string;
  po: string;
  fornecedor: string;
}

async function fetchReport(params: ReportParams): Promise<Blob> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const response = await fetch(`/api/report/envios?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao gerar relatório");
  }

  return response.blob();
}

export default function ReportFornecedores() {
  const [dataIni, setDataIni] = useState("");
  const [dataFini, setDataFini] = useState("");
  const [op, setOp] = useState("");
  const [po, setPo] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["report-fornecedores", dataIni, dataFini, op, po, fornecedor],
    queryFn: () => fetchReport({ dataIni, dataFini, op, po, fornecedor }),
    enabled: shouldFetch,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });

  const handleGenerate = () => {
    setShouldFetch(true);
    refetch();
  };

  // When data is available, open it in a new tab
  if (data && shouldFetch) {
    const url = URL.createObjectURL(data);
    window.open(url, "_blank");
    setShouldFetch(false);

    // Clean up the URL object after opening
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            Relatório - Contratos de Fornecedores
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Erro:{" "}
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="dataIni">Data Inicial</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="dataIni"
                type="date"
                className="pl-8"
                value={dataIni}
                onChange={(e) => setDataIni(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dataFini">Data Final</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id="dataFini"
                type="date"
                className="pl-8"
                value={dataFini}
                onChange={(e) => setDataFini(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="op">OP</Label>
            <Input
              id="op"
              placeholder="Ex: 12345"
              value={op}
              onChange={(e) => setOp(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="po">PO</Label>
            <Input
              id="po"
              placeholder="Ex: 78910"
              value={po}
              onChange={(e) => setPo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              placeholder="Ex: ABC Indústrias"
              value={fornecedor}
              onChange={(e) => setFornecedor(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar PDF"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
