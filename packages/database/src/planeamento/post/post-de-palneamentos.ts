import { Decimal } from "@prisma/client/runtime/library";
import {
  OpSchema,
  PosNovosPlaneamentosDto,
  QantidadeOpSchema,
} from "@repo/tipos/planeamento";

import { getOpAbertaDb } from "../get/get-op-aberta";

import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

type Planeamento = {
  departamento_id: number;
  qtt: number;
  valor: Decimal | null;
  createdAt: Date;
  endDate: Date | null;
  enviado: boolean;
  plan_id: number;
  sub_contratado_id: string | null;
};

export const postDePlaneamentosDB = async (
  dadosRecebidos: PosNovosPlaneamentosDto
) => {
  const { idDestino, ops, maisQueUmaOP } = dadosRecebidos;

  if (!ops?.length) throw new Error("Nada a inserir...");

  const opsAPesquisar = ops.map((op) => op.op);

  const dadosAInserir = await getOpAbertaDb(opsAPesquisar);

  if (!dadosAInserir?.length) throw new Error("Nada a inserir...");

  let emptyPlaneamento: Planeamento | null = null;

  if (maisQueUmaOP) {
    const qttPlaneada = dadosAInserir.reduce(
      (total, item) => total + Number(item.quantidade),
      0
    );

    const departamento = await prismaQualidade.departamentos.findUnique({
      where: { departamento: dadosAInserir[0]?.departamento },
    });

    if (!departamento) throw new Error("Erro no departamento");

    emptyPlaneamento = await prismaQualidade.planos.create({
      data: {
        sub_contratado_id: idDestino,
        departamento_id: departamento.departamento_id,
        qtt: qttPlaneada,
      },
    });
  }

  await prismaQualidade.$transaction(async (tx) => {
    for (const dadosOp of dadosAInserir) {
      const quantidadeResult = QantidadeOpSchema.safeParse(dadosOp.quantidade);

      if (!quantidadeResult.success)
        throw new Error(`Erro na quantidade para OP ${dadosOp.op}`);

      const opResult = OpSchema.safeParse(dadosOp.op);

      if (!opResult.success) throw new Error(`Erro na OP ${dadosOp.op}`);

      if (!maisQueUmaOP) {
        const departamento = await tx.departamentos.findUnique({
          where: { departamento: dadosOp.departamento },
        });

        if (!departamento)
          throw new Error(
            `Departamento não encontrado: ${dadosOp.departamento}`
          );

        emptyPlaneamento = await tx.planos.create({
          data: {
            sub_contratado_id: idDestino,
            departamento_id: departamento.departamento_id,
            qtt: quantidadeResult.data,
          },
        });
      }

      await tx.ops.upsert({
        where: { op_chave: dadosOp.op_chave },
        update: {
          qtt: quantidadeResult.data,
          foto: dadosOp.foto,
        },
        create: {
          op_chave: dadosOp.op_chave,
          op: opResult.data,
          pedido_cliente: dadosOp.pedido,
          ref: dadosOp.ref,
          modelo: dadosOp.modelo,
          descricao: dadosOp.descricao,
          cor_nome: dadosOp.corNome,
          foto: dadosOp.foto,
          qtt: quantidadeResult.data,
        },
      });

      if (!emptyPlaneamento)
        throw new Error("Plano não foi criado antes de inserir plano_ops");

      await tx.plano_ops.create({
        data: {
          plan_id: emptyPlaneamento.plan_id,
          op_chave: dadosOp.op_chave,
          foto: dadosOp.foto,
          qtt: quantidadeResult.data,
        },
      });
    }
  });
};
