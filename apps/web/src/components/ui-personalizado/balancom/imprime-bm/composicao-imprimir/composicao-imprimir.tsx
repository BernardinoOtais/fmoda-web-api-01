import React from "react";

type ComposicaoImprimirProps = {
  composicao: string;
};

const ComposicaoImprimir = ({ composicao }: ComposicaoImprimirProps) => {
  return (
    <div className="mx-auto">
      <p className="text-center font-semibold text-[9px]">Composição:</p>
      <p className="text-center text-[9px]">{composicao}</p>
    </div>
  );
};

export default ComposicaoImprimir;
