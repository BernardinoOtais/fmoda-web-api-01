import React from "react";

type TcssImprimirProps = {
  dataTc: {
    idBm: string;
    nomeTc: string;
  }[];
};
const TcssImprimir = ({ dataTc }: TcssImprimirProps) => {
  return (
    <div className="mx-auto">
      <p className="text-center font-semibold text-[9px]">TCs:</p>
      <div className="flex flex-col items-center justify-center">
        <ul className="list-disc list-inside text-[9px]  ">
          {dataTc.map((tc) => (
            <li key={tc.nomeTc}>{tc.nomeTc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TcssImprimir;
