export type TabKey = "op" | "orc" | "livre";
import { RowSelectionState } from "@tanstack/react-table";

export interface Menu {
  chave: TabKey;
  nome: string;
  desc: string;
}

export interface PostPorOp {
  op: number;
}

export interface OpState {
  maisQueUmaOP: boolean;
  setMaisQueUmaOp: React.Dispatch<React.SetStateAction<boolean>>;
  ops: PostPorOp[];
  setOps: React.Dispatch<React.SetStateAction<PostPorOp[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  opsForSchema: PostPorOp[];
  setOpsForSchema: React.Dispatch<React.SetStateAction<PostPorOp[]>>;
}

export interface PlaneamentoState {
  op?: OpState;
  orc?: Record<string, never>;
  livre?: Record<string, never>;
}

export interface PlaneamentoContextType {
  menus: readonly Menu[];
  titulo?: string;
  idDestino: string;
  setIdDestino: React.Dispatch<React.SetStateAction<string>>;
  posting: boolean;
  setPosting: React.Dispatch<React.SetStateAction<boolean>>;
  state: PlaneamentoState;
}

export const MENUS_DISPONIVEIS: readonly Menu[] = [
  {
    chave: "op",
    nome: "Cria Planeamentos por Op",
    desc: "Aqui pode criar planeamentos via Op...",
  },
  {
    chave: "orc",
    nome: "Cria Planeamentos via Orçamento",
    desc: "Aqui pode criar planeamentos via Orçamento...",
  },
  {
    chave: "livre",
    nome: "Cria Planeamentos Livres",
    desc: "Aqui pode criar planeamentos Livres...",
  },
] as const;

export const DEFAULT_TAB: TabKey = "op";
