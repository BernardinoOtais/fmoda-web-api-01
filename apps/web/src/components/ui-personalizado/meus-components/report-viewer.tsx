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

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center">
        <a
          href={fileUrl}
          download={fileName}
          className="
      text-base font-medium underline underline-offset-4
      text-foreground hover:text-muted-foreground hover:underline
      dark:text-foreground dark:hover:text-muted-foreground
      transition-colors cursor-pointer
    "
        >
          Download {format === "EXCELOPENXML" ? "Excel" : "PDF"} Report
        </a>
      </div>
    );
  }

  if (format === "EXCELOPENXML") {
    return (
      <div className="flex flex-col items-center justify-center ">
        <a
          href={fileUrl}
          download={fileName}
          className="
      text-base font-medium underline underline-offset-4
      text-foreground hover:text-muted-foreground hover:underline
      dark:text-foreground dark:hover:text-muted-foreground
      transition-colors cursor-pointer
    "
        >
          Download Excel Report
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={fileUrl}
      className="w-full h-full"
      style={{ border: "none" }}
      title="PDF Report"
    />
  );
};

export default ReportViewer;
