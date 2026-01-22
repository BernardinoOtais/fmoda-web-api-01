import { DistPorCaixaDto } from "@repo/tipos/planeamento/lotes";
import React, { useState } from "react";

import CaixasDist from "./caixas-dist";
import VariaveisDist from "./variaveis-dist";

import useDebounce from "@/hooks/use-debounce";

type CorpoOpLotesWrapperProps = {
  distPorCaixa: DistPorCaixaDto;
  bostamp: string;
  op: number;
};

const CorpoOpLotesWrapper = ({
  distPorCaixa,
  bostamp,
  op,
}: CorpoOpLotesWrapperProps) => {
  const [numeroPecaCaixa, setNumeroPecaCaixa] = useState<number | "">(
    distPorCaixa?.numeroPecaCaixa ?? "",
  );
  const [qttTamanhosAJuntar, setQttTamanhosAJuntar] = useState<number | "">(
    distPorCaixa?.qttTamanhosAJuntar ?? "",
  );
  const debouncedNumeroPecaCaixa = useDebounce(numeroPecaCaixa, 1250);
  const debouncedQttTamanhosAJuntar = useDebounce(qttTamanhosAJuntar, 1250);

  return (
    <>
      <VariaveisDist
        distPorCaixa={distPorCaixa}
        bostamp={bostamp}
        op={op}
        setNumeroPecaCaixa={(dados: number | "") => setNumeroPecaCaixa(dados)}
        debouncedNumeroPecaCaixa={debouncedNumeroPecaCaixa}
        numeroPecaCaixa={numeroPecaCaixa}
        setQttTamanhosAJuntar={(dados: number | "") =>
          setQttTamanhosAJuntar(dados)
        }
        debouncedQttTamanhosAJuntar={debouncedQttTamanhosAJuntar}
        qttTamanhosAJuntar={qttTamanhosAJuntar}
      />
      <CaixasDist
        op={op}
        numeroPecaCaixa={numeroPecaCaixa}
        qttTamanhosAJuntar={qttTamanhosAJuntar}
      />
    </>
  );
};

export default CorpoOpLotesWrapper;
