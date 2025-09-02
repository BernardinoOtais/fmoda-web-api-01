import { getOpAbertasDb } from "@repo/db/planeamento";
import { saveBase64Image } from "@repo/imagens";
import { PAPEL_ROTA_PLANEAMENTO } from "@repo/tipos/consts";
import { CenasECoisa, uploadPhotoSchema } from "@repo/tipos/foto";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, roleProtectedProcedure } from "@/init";
import { string } from "zod";

const PAPEL_ROTA = PAPEL_ROTA_PLANEAMENTO;

export const planeamento = createTRPCRouter({
  getOpAbertas: roleProtectedProcedure(PAPEL_ROTA).query(async () => {
    try {
      return await getOpAbertasDb();
    } catch (err) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Erro ao obter envio.",
        cause: err, // optional, for logging/debugging
      });
    }
  }),
  patchEstadoItem: roleProtectedProcedure(PAPEL_ROTA)
    .input(uploadPhotoSchema)
    .mutation(async ({ input }) => {
      try {
        const { base64, filename } = input;
        return saveBase64Image(base64, filename);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao inserir foto...",
          cause: err, // optional, for logging/debugging
        });
      }
    }),
});

/*


front end

import { trpc } from "@/utils/trpc";

export function UploadFile() {
  const uploadMutation = trpc.embarques_configorar.uploadFile.useMutation();

  function handleUpload(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1]; // strip data:image/png;base64,
      if (base64) {
        uploadMutation.mutate({ base64, filename: file.name });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUpload(e.target.files[0]);
        }}
      />
      {uploadMutation.data && (
        <p>Saved at: {uploadMutation.data.url}</p>
      )}
    </div>
  );
}

*/
