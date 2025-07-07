import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ApagaConteudoProps = {
  nome: string;
  idConteudo: number;
  setItensSelecionados: React.Dispatch<React.SetStateAction<number[]>>;
  estaSelecionado: boolean;
  disabledApaga: boolean;
};
const ApagaConteudo = ({
  nome,
  idConteudo,
  setItensSelecionados,
  estaSelecionado,
  disabledApaga,
}: ApagaConteudoProps) => {
  const apagoConteudoFun = () => {
    setItensSelecionados(prev =>
      prev.includes(idConteudo)
        ? prev.filter(id => id !== idConteudo)
        : [...prev, idConteudo],
    );
  };
  return (
    <Button
      className="group hover:bg-primary/40 relative m-0 h-5 cursor-pointer p-0"
      variant="ghost"
      onClick={apagoConteudoFun}
      name={
        estaSelecionado ? "Remove selecção..." : "Selecciona para apagar..."
      }
      disabled={disabledApaga}
    >
      <span>{nome}</span>
      <Badge
        variant={estaSelecionado ? "default" : "destructive"}
        className="absolute top-[-10px] right-[-15px] hidden h-5 w-5 items-center justify-center rounded-full text-xs font-bold group-hover:flex"
      >
        {estaSelecionado ? "-" : "x"}
      </Badge>
    </Button>
  );
};

export default ApagaConteudo;
