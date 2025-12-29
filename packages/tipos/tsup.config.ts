import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",

    "src/api/android/auth/index.ts",
    "src/api/android/marrocos/envios/index.ts",
    "src/api/android/marrocos/envios/fim/index.ts",
    "src/api/android/marrocos/paletes/index.ts",
    "src/api/android/marrocos/caixas/index.ts",
    "src/api/android/especial/index.ts",
    "src/api/android/resumo/index.ts",
    "src/api/android/imagem/index.ts",
    "src/api/android/cortes/envios/index.ts",
    "src/api/android/cortes/envios/lotes/index.ts",
    "src/api/android/cortes/fim/index.ts",

    "src/api/qrcode/index.ts",
    "src/api/tradutor/index.ts",

    "src/user/user.schemas.ts",

    "src/embarques/raiz/index.ts",
    "src/embarques/id-envio/index.ts",
    "src/embarques/configurar/index.ts",

    "src/qualidade/balancom/index.ts",
    "src/qualidade/balancom/composicao/index.ts",

    "src/consts/index.ts",

    "src/foto/index.ts",

    "src/pdf/index.ts",

    "src/joana/entradas-mc-ma/index.ts",
    "src/joana/est-e-borda/index.ts",
    "src/joana/cortes-por-op/index.ts",
    "src/joana/faturas/index.ts",
    "src/joana/faturas-planeadas/index.ts",
    "src/joana/envios-marrocos/index.ts",

    "src/rfid/index.ts",

    "src/planeamento/index.ts",
  ],

  outDir: "dist",
  format: ["cjs"],
  dts: true,
  clean: true,

  sourcemap: false, // Disable if not needed

  external: ["zod"],
});
