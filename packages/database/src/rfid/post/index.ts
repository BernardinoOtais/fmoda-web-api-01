import { PostRfidFinalDto } from "@repo/tipos/rfid";

import { prismaEnvios } from "@/prisma-servicos/envios/envios";

export const postRfidsDb = async (postRfidDto: PostRfidFinalDto) => {
  if (
    !postRfidDto ||
    !postRfidDto.rows?.length ||
    !postRfidDto.correspodencia
  ) {
    throw new Error("Dados inválidos: PostRfidDto está incompleto ou vazio.");
  }
  const origens = [
    ...new Set(postRfidDto.correspodencia.map((origen) => origen.idFornecedor)),
  ];
  if (origens.length != 1) {
    throw new Error("Mais de um fornecedor encontrado.");
  }

  const origem = origens[0];

  if (!origem) {
    throw new Error("Erro no fornecedor.");
  }

  try {
    const resultado = await prismaEnvios.$transaction(
      async (tx) => {
        // Ensure destination exists

        //console.log("rfid", 0, origem);
        const temEsteDestino = await tx.rfidOrigem.findUnique({
          where: { idDestino: origem },
        });

        //console.log("rfid", 1, temEsteDestino);

        if (!temEsteDestino) {
          await tx.$queryRawUnsafe(`
          INSERT INTO RfidOrigem
          SELECT
              RTRIM(a.flstamp),
              RTRIM(a.nome)
          FROM fmo_phc.dbo.FL a
          WHERE a.flstamp = '${origem}'
        `);
        }

        //console.log("rfid", 2);
        // Register leitura

        const leitura = await tx.rfidLeitura.create({
          data: {
            idDestino: origem,
            maxDataLeitura: new Date(),
            nomeUser: "Bernardino",
            obs: "Leitura de teste",
          },
        });

        //console.log("rfid", 2, leitura);
        const pedidoOP = postRfidDto.correspodencia.map((pedido) => ({
          idLeitura: leitura.idLeitura,
          orderId: pedido.order_id,
          op: pedido.obrano,
        }));

        //console.log("rfid", 3, pedidoOP);
        await tx.rfidPedidoOp.createMany({ data: pedidoOP });

        const rfidsToInsert = postRfidDto.rows.map((row, index) => ({
          idLeitura: leitura.idLeitura,
          orderId: row.order_id,
          cartonId: row.carton_id || "",
          epcUnico: `${index}-${row.epc}-${row.order_id}`,
          epc: `${row.epc}`,
          timestamp: new Date(row.timestamp),
        }));

        //console.log("rfid", 6);
        if (rfidsToInsert.length === 0) {
          throw new Error("Nenhum RFID para inserir.");
        }

        await tx.rfids.createMany({
          data: rfidsToInsert,
        });

        console.log("rfid", 8);
        const maxTimestamp = rfidsToInsert.reduce((latest, row) => {
          return row.timestamp > latest ? row.timestamp : latest;
        }, rfidsToInsert[0]?.timestamp ?? new Date());

        await tx.rfidLeitura.update({
          where: { idLeitura: leitura.idLeitura },
          data: { maxDataLeitura: maxTimestamp },
        });

        //console.log("rfid", 9);
        return "ok";
      },
      {
        timeout: 30000, // in ms, i.e., 30 seconds
      }
    );

    //console.log("rfid", 10);
    return resultado;
  } catch (err) {
    console.error("Erro ao inserir RFIDs:", err);
    throw new Error("Falha ao processar inserção de RFIDs.");
  }
};
