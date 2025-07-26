export const fornecedoresPedidos = (
  pedidosCompra: (
    | {
        idBm: string;
        ref: string;
        unidade: string;
        op: number;
        idBmMovimentosLote: string;
        idMovimento: string;
        nMovimento: number;
        nome: string;
        idTipo: number;
        tipo: string;
        qtt: number;
        lote: string;
      }
    | undefined
  )[]
) => {
  type Result = {
    [key: string]: number[];
  };

  const result: Result = {};

  pedidosCompra.forEach((item) => {
    if (item && item.idTipo === 2) {
      const { nome, nMovimento } = item;
      if (!result[nome]) {
        result[nome] = [];
      }
      result[nome].push(nMovimento);
    }
  });

  return (
    <div>
      {Object.entries(result).map(([nome, nCompras]) => (
        <div className="flex flex-col items-center justify-center" key={nome}>
          <span className="text-xs">{nome}</span>
          <span className="text-xs">{nCompras.join(", ")}</span>
        </div>
      ))}
    </div>
  );
};
