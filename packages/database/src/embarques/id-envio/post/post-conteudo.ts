import { PostConteudoDto } from "@repo/tipos/embarques_idenvio";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postConteudoDb = async (conteudo: PostConteudoDto) => {
  const { op, idContainer, idItem, idUnidades, TamanhosQttPeso } =
    conteudo.conteudo;

  const tamanhosSemZeros = TamanhosQttPeso.filter(
    ({ qtt, peso, pesoUnit }) => qtt !== 0 && (peso !== 0 || pesoUnit !== 0)
  );
  const tam = tamanhosSemZeros.map(({ tam }) => tam);

  await prismaEnvios.$transaction(async (tx) => {
    const conteudoExistente = await tx.conteudo.findMany({
      where: { op, idItem, idUnidades, idContainer, tam: { in: tam } },
    });

    await Promise.all(
      conteudoExistente.map((c) =>
        tx.conteudo.update({
          where: { idConteudo: c.idConteudo },
          data: {
            peso: Number(
              (tamanhosSemZeros.find(({ tam }) => tam === c.tam)?.peso === 0
                ? (tamanhosSemZeros.find(({ tam }) => tam === c.tam)?.qtt ??
                  c.qtt *
                    ((tamanhosSemZeros.find(({ tam }) => tam === c.tam)
                      ?.pesoUnit ?? 0) as number))
                : tamanhosSemZeros.find(({ tam }) => tam === c.tam)?.peso) ??
                c.peso
            ),
            qtt:
              Number(tamanhosSemZeros.find(({ tam }) => tam === c.tam)?.qtt) ||
              c.qtt,
          },
        })
      )
    );

    // Insert new records
    const tamanhosNaoCorrespondentes = tamanhosSemZeros.filter(
      ({ tam }) =>
        !conteudoExistente.some(({ tam: existingTam }) => existingTam === tam)
    );

    const dadosAInserir = tamanhosNaoCorrespondentes.map((t) => ({
      idContainer,
      idItem,
      op,
      tam: t.tam,
      qtt: Number(t.qtt),
      idUnidades,
      peso: t.peso === 0 ? Number(t.qtt) * Number(t.pesoUnit) : Number(t.peso),
    }));

    if (dadosAInserir.length > 0) {
      await tx.conteudo.createMany({ data: dadosAInserir });
    }
  });
};
