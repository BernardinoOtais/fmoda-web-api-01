import { authorizePapelOrRedirect } from "@repo/authweb/autorizado";
import { PAPEL_FERNANDA } from "@repo/tipos/consts";
import { dehydrate, HydrationBoundary } from "@repo/trpc";
import React, { Suspense } from "react";

import FaturacaoResumo from "@/components/ui-personalizado/faturacao/faturacao-resumo";
import FaturacaoPlaneadaResumo from "@/components/ui-personalizado/faturacao-planeada/faturacao-planeada-resumo";
import { getQueryClient, trpc } from "@/trpc/server";

const Fernanda = async () => {
  await authorizePapelOrRedirect(PAPEL_FERNANDA);
  const queryClient = getQueryClient();

  const agora = new Date();
  const dayOfWeek = agora.getDay();

  const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  const dataSemanaIni = new Date(agora);
  dataSemanaIni.setDate(agora.getDate() - (isoDay - 1));

  const dataSemanaFini = new Date(dataSemanaIni);
  dataSemanaFini.setDate(dataSemanaIni.getDate() + 6);

  const hora = agora.getHours();

  void queryClient.prefetchQuery(
    trpc.joanaFaturacao.getFaturacao.queryOptions({
      dataIni: dataSemanaIni,
      dataFini: dataSemanaFini,
      op: null,
    })
  );

  // First day of current month
  const dataMesIni = new Date(agora.getFullYear(), agora.getMonth(), 1);

  // Last day of current month
  const dataMesFini = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

  void queryClient.prefetchQuery(
    trpc.joanaFaturacaoPlaneada.getFaturacaoPlaneada.queryOptions({
      dataIni: dataMesIni,
      dataFini: dataMesFini,
      fornecedor: null,
    })
  );

  let saudacao = "Boa noite, D. Fernanda 🌙"; // valor por defeito
  if (hora < 12) {
    saudacao = "Bom dia, D. Fernanda ☀️";
  } else if (hora < 18) {
    saudacao = "Boa tarde, D. Fernanda 🌤️";
  }

  return (
    <>
      <header>
        <div className="flex lg:flex-row flex-col  items-center p-2">
          <span className="text-2xl font-semibold mx-auto">{saudacao}</span>
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div className="flex w-full flex-col items-center overflow-auto gap-3">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<div>loading...</div>}>
                <FaturacaoResumo
                  dataIni={dataSemanaIni}
                  dataFini={dataSemanaFini}
                />
              </Suspense>

              <Suspense fallback={<div>loading...</div>}>
                <FaturacaoPlaneadaResumo
                  dataIni={dataMesIni}
                  dataFini={dataMesFini}
                />
              </Suspense>
            </HydrationBoundary>
          </div>
        </div>
      </main>
    </>
  );
};

export default Fernanda;
