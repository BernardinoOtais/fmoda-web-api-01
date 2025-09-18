"use client";
import { useSuspenseQuery } from "@repo/trpc";
import React, { useMemo } from "react";

import { colunasPlaneamentos } from "./_planeamentos/colunas";
import { DataTablePlaneamnetos } from "./_planeamentos/data-table";

import { useTRPC } from "@/trpc/client";

const PlaneamentoConteudo = () => {
  const colunas = useMemo(() => colunasPlaneamentos(), []);

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.planeamento.getPlaneamentos.queryOptions(
      { enviado: false },
      {
        staleTime: Infinity,
      }
    )
  );

  return <DataTablePlaneamnetos columns={colunas} data={data} />;
};

export default PlaneamentoConteudo;

/*




  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const ficheiros = event.dataTransfer.files;

    // escreveImagem(ficheiros);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFoto(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // generate local preview
    }
  };




    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <Input
        type="file"
        onChange={handleFileChange}
        hidden
        accept="image/png, image/jpeg"
        ref={inputRef}
      />

      <Image
        src={preview ?? "/assets/placeholder.png"} // must be a valid image string
        alt="Foto"
        width="200"
        height="200"
        className="pe-1"
        onClick={() => {
          console.log("Cliquei na imagem....");
          inputRef.current?.click();
        }}
      />
    </div>
*/
