"use client";

import React from "react";

interface ReportViewerProps {
  fileUrl: string;
  format: "PDF" | "EXCELOPENXML";
}

/**
 * Displays the PDF inline inside an iframe.
 * (Excel and mobile download logic are handled in the parent.)
 */
const ReportViewer = ({ fileUrl, format }: ReportViewerProps) => {
  if (format !== "PDF") return null;

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
