export type PlaneamentoLinha = {
  id: number;
  valor: string;
  qtt: number;
  pedido_cliente: string | null;
  modelo: string;
  descricao: string;
  cor_nome: string | null;
  departamentos: {
    departamento_id: number;
    departamento: string;
  };
  plano_livres: {
    modelo: string;
    qtt: number;
    descricao: string;
    ops: {
      modelo: string;
      qtt: number;
      descricao: string;
      foto: string;
      op: number;
      pedido_cliente: string;
      cor_nome: string;
    } | null;
    foto: string;
    op_chave: string | null;
    pedido_cliente: string | null;
    cor_nome: string | null;
    plan_livre_id: number;
    hotizontal: boolean;
  }[];
  plano_ops: {
    qtt: number;
    ops: {
      modelo: string;
      qtt: number;
      descricao: string;
      foto: string;
      op: number;
      pedido_cliente: string;
      cor_nome: string;
    };
    foto: string;
    plan_op_id: number;
    horizontal: boolean;
  }[];
  sub_contratados: {
    sub_contratado_id: string;
    sub_contratado_nome: string;
  } | null;
  plan_id: number;
};
