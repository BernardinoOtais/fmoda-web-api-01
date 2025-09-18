import { prismaQualidade } from "@/prisma-servicos/qualidade/qualidade";

export const getPlaneamentosDb = async (
  enviado: boolean,
  sub_contratado_id?: string
) => {
  const planeamentos = await prismaQualidade.planos.findMany({
    where: {
      enviado,
      ...(sub_contratado_id ? { sub_contratado_id } : {}),
    },
    select: {
      plan_id: true,
      departamentos: true,
      sub_contratados: true,
      modelo: true,
      descricao: true,
      cor_nome: true,
      qtt: true,
      valor: true,
      plano_ops: {
        select: {
          plan_op_id: true,
          foto: true,
          horizontal: true,
          qtt: true,
          ops: {
            select: {
              op_chave: true,
              pedido_cliente: true,
              modelo: true,
              descricao: true,
              cor_nome: true,
              foto: true,
              qtt: true,
            },
          },
        },
      },
      plano_livres: {
        select: {
          plan_livre_id: true,
          op_chave: true,
          pedido_cliente: true,
          modelo: true,
          descricao: true,
          cor_nome: true,
          foto: true,
          hotizontal: true,
          qtt: true,
          ops: {
            select: {
              op_chave: true,
              pedido_cliente: true,
              modelo: true,
              descricao: true,
              cor_nome: true,
              foto: true,
              qtt: true,
            },
          },
        },
      },
    },
  });

  return planeamentos.map((plano) => ({
    ...plano,
    id: plano.plan_id,
    valor: plano.valor ? plano.valor.toString() : "",
  }));
};
