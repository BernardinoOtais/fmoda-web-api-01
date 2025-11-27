"use client";
import { CsvRowsRfidDto } from "@repo/tipos/rfid";
import React, { useRef, useState } from "react";

import InsereCsvFormEvoluido from "./insere-csv-form-evoluido";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InsereCsv = () => {
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CsvRowsRfidDto>([]);
  const [distinctOrderIds, setDistinctOrderIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setRows([]);
    setDistinctOrderIds([]);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("File must be a .csv file");
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");

        const header = lines[0]?.trim();
        if (header !== "order_id,carton_id,epc,timestamp") {
          throw new Error(
            "Invalid header. Must be: order_id,carton_id,epc,timestamp"
          );
        }

        const seenOrderIds = new Set<string>();
        const parsedRows: CsvRowsRfidDto = [];

        lines.slice(1).forEach((line, index) => {
          if (!line.trim()) {
            return; // Just skip empty lines
          }

          const parts = line.split(",").map((p) => p.trim());

          if (parts.length !== 4) {
            throw new Error(`Invalid CSV format on line ${index + 2}`);
          }

          const [order_id, carton_id, epc, timestamp] = parts;

          if (!order_id || !epc || !timestamp) {
            throw new Error(`Missing required field on line ${index + 2}`);
          }

          parsedRows.push({
            order_id,
            carton_id: carton_id || "",
            epc,
            timestamp,
          });
          seenOrderIds.add(order_id.toUpperCase());
        });

        // Final state update after successful parsing
        setRows(parsedRows);

        setDistinctOrderIds([...seenOrderIds]);
        setError(null);
      } catch (err: unknown) {
        setRows([]);
        setDistinctOrderIds([]);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to parse CSV");
        }
      }
    };

    reader.onerror = () => {
      setRows([]);
      setDistinctOrderIds([]);
      setError("Failed to read file");
    };

    reader.readAsText(file);
  };

  return (
    <div className="grid w-full items-start gap-2">
      <Label htmlFor="csvUpload">Upload ficheiro CSV</Label>
      <Input
        className="w-full"
        id="csvUpload"
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {distinctOrderIds.length > 0 && (
        <div className="mt-4">
          <InsereCsvFormEvoluido
            pedidos={distinctOrderIds}
            linhasCsv={rows}
            resetFileInput={resetFileInput}
          />
        </div>
      )}
    </div>
  );
};

export default InsereCsv;
