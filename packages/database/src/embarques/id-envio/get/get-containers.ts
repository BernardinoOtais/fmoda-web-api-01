import { prismaEnvios } from "@/prisma-servicos/envios/envios";
import { IdNumeroInteiroNaoNegativoDto } from "@repo/tipos/comuns";
import { ListaContainersETipoPaiDto } from "@repo/tipos/embarques_idenvio";

export const getContainersDb = async ({
  id,
  idd,
}: IdNumeroInteiroNaoNegativoDto): Promise<ListaContainersETipoPaiDto> => {
  if (!idd) {
    const resultado = await prismaEnvios.container.findMany({
      where: { idContainerPai: null, idEnvio: id },
      select: {
        idContainer: true,
        idContainerPai: true,
        idTipoContainer: true,
        ordem: true,
        nContainer: true,
        altura: true,
        TipoContainer: {
          select: {
            idItem: true,
            Item: {
              select: {
                Descricao: true,
              },
            },
          },
        },
        ContainerOp: {
          select: {
            op: true,
            Op: {
              select: {
                op: true,
                ref: true,
                modeloDesc: true,
                modelo: true,
                cor: true,
                pedido: true,
                norma: true,
                OpTamanho: {
                  select: {
                    tam: true,
                    ordem: true,
                    qtt: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            other_Container: true,
            Conteudo: true,
          },
        },
      },
      orderBy: idd
        ? [{ idTipoContainer: "asc" }, { ordem: "asc" }]
        : [{ ordem: "asc" }],
    });
    return {
      containers: resultado,
    };
  }

  const [principal, tipoContainer] = await Promise.all([
    prismaEnvios.container.findMany({
      where: idd
        ? { idContainerPai: idd, idEnvio: id }
        : { idEnvio: id, idContainerPai: null },
      select: {
        idContainer: true,
        idContainerPai: true,
        idTipoContainer: true,
        ordem: true,
        nContainer: true,
        altura: true,
        TipoContainer: {
          select: {
            idItem: true,
            Item: {
              select: {
                Descricao: true,
              },
            },
          },
        },
        ContainerOp: {
          select: {
            op: true,
            Op: {
              select: {
                op: true,
                ref: true,
                modeloDesc: true,
                modelo: true,
                cor: true,
                pedido: true,
                norma: true,
                OpTamanho: {
                  select: {
                    tam: true,
                    ordem: true,
                    qtt: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            other_Container: true,
            Conteudo: true,
          },
        },
      },
      orderBy: idd
        ? [{ idTipoContainer: "asc" }, { ordem: "asc" }]
        : [{ ordem: "asc" }],
    }),
    prismaEnvios.container.findUnique({
      where: { idContainer: idd },
      select: { idTipoContainer: true },
    }),
  ]);

  return {
    containers: principal,
    idTipoContainer: tipoContainer?.idTipoContainer,
  };
};
