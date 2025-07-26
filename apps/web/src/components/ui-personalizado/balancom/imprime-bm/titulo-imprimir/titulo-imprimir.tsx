import React from "react";

type TituloImprimirProps = {
  nOps?: number;
  opString: string;
};
const TituloImprimir = ({ nOps, opString }: TituloImprimirProps) => {
  return (
    <p className="text-center font-semibold text-[9px]">
      {nOps === 1
        ? `Balanço de Massas da Op: ${opString}`
        : `Balanço de Massas das Op's: ${opString}`}
    </p>
  );
};

export default TituloImprimir;
