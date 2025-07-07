import { DestinoEnvioDto } from "@repo/tipos/embarques_idenvio";
import React from "react";

type PackingListDestinoProps = { destino: DestinoEnvioDto };
const PackingListDestino = ({ destino }: PackingListDestinoProps) => {
  return (
    <div className="flex flex-row">
      <div className="mr-auto flex flex-col">
        <p className="text-xs">Fmoda - Indústria Têxril, SA.</p>
        <p className="text-xs">AVENIDA DA INDÚSTRIA, PORTA 446</p>
        <p className="text-xs">ZONA INDUSTRIAL DE BRITO</p>
        <p className="text-xs">4805-019 Brito Guimarães</p>
      </div>
      <div className="flex flex-col">
        <p className="text-xs">{destino.nomeDestino.trim()}</p>
        <p className="text-xs">{destino.morada.trim()}</p>
        <p className="text-xs">{`${destino.localMorada.trim()} ${destino.codigoPostal.trim()}`}</p>
        <p className="text-xs">{destino.nacionalidade.trim()}</p>
      </div>
    </div>
  );
};

export default PackingListDestino;
