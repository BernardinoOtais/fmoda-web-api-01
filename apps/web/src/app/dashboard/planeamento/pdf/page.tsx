"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Type for API response
type PdfParseResult = {
  rows: string[][];
};

export default function ImportarPdf() {
  const [file, setFile] = useState<File | null>(null);

  // Mutation to call your Next.js API route
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
        throw new Error(json.error || "Failed to parse PDF");
      }

      return res.json() as Promise<PdfParseResult>;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutate(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button type="submit" disabled={!file || isPending}>
              {isPending ? "Parsing..." : "Upload & Parse PDF"}
            </Button>
          </form>
          {isError && <p className="text-red-500 mt-2">{error?.message}</p>}
        </CardContent>
      </Card>

      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
