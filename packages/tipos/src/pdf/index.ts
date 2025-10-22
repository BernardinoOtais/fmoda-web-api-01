export type PdfText = {
  x: number;
  y: number;
  text: string;
};

export type Pdf2JsonText = {
  x: number;
  y: number;
  w: number;
  sw: number;
  A: string;
  R: { T: string }[];
};

export type Pdf2JsonPage = {
  Texts: Pdf2JsonText[];
  Width?: number;
  Height?: number;
};

export type Pdf2JsonData = {
  Pages: Pdf2JsonPage[];
  Meta?: Record<string, string | number | boolean | null>;
  Width?: number;
  Height?: number;
};
