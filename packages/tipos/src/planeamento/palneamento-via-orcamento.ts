import z from "zod";

import { NumeroInteiroMaiorQueZero, StringComTamanhoSchema } from "@/comuns";

export const PlaneamentoViaOrcamentoSchemaDef = z.object({
  nFicha: NumeroInteiroMaiorQueZero,
  ano: NumeroInteiroMaiorQueZero,
  descricao: StringComTamanhoSchema(100),
  descricaoDesenho: StringComTamanhoSchema(100),
  refcli: StringComTamanhoSchema(40),
  reft: StringComTamanhoSchema(40),
  refInterna: StringComTamanhoSchema(40),
  imagem: StringComTamanhoSchema(500),
  departamento: StringComTamanhoSchema(100),
});

export const GetPlaneamentoViaOrcamentoSchemaDef = z.object({
  ano: NumeroInteiroMaiorQueZero,
  nFicha: NumeroInteiroMaiorQueZero,
});
