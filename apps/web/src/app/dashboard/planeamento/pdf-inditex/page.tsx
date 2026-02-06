"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Type for API response
type PdfParseResult = {
  rows: string[][];
};

export default function ImportarPdf() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, isError, data, error } = useMutation<
    PdfParseResult,
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pdf2json", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Falha ao importar PDF");
      }

      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutate(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Hidden input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {/* Custom trigger */}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? file.name : "Selecionar PDF"}
            </Button>

            {/* Submit */}
            <Button type="submit" disabled={!file || isPending}>
              {isPending ? "Importar..." : "Upload & importar PDF"}
            </Button>
          </form>

          {isError && <p className="text-red-500 mt-2">{error?.message}</p>}
        </CardContent>
      </Card>

      {data && (
        <pre className="rounded-md bg-muted p-4 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
