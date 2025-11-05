"use client";
import React, { useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

interface ReportViewerProps {
  fileUrl: string;
  format: "PDF" | "EXCELOPENXML";
}

const ReportViewer = ({ fileUrl, format }: ReportViewerProps) => {
  const isMobile = useIsMobile();
  const extension = format === "EXCELOPENXML" ? "xlsx" : "pdf";
  const [fileName, setFileName] = useState(`report.${extension}`);

  useEffect(() => {
    setFileName(`report.${extension}`);
  }, [extension, format]);

  useEffect(() => {
    if (isMobile) {
      const link = document.createElement("a");

      let cleanName = fileName;
      if (!cleanName.endsWith(`.${extension}`)) {
        cleanName = `${cleanName.split(".")[0]}.${extension}`;
      }

      link.href = fileUrl;
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [isMobile, fileUrl, fileName, extension]);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
        Préparation de votre téléchargement...
      </div>
    );
  }

  if (format === "EXCELOPENXML") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <a
          href={fileUrl}
          download={fileName}
          className="
            text-base font-medium underline underline-offset-4
            text-foreground hover:text-muted-foreground hover:underline
            transition-colors cursor-pointer
          "
        >
          Télécharger le rapport Excel
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={fileUrl}
      className="w-full h-full"
      style={{ border: "none" }}
      title="Rapport PDF"
    />
  );
};

export default ReportViewer;
