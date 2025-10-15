"use client";

import {
  DEFAULT_TAB,
  Menu,
  MENUS_DISPONIVEIS,
  OpState,
  PlaneamentoContextType,
  PlaneamentoState,
  PostPorOp,
  TabKey,
} from "@repo/tipos/planeamento";
import { RowSelectionState } from "@tanstack/react-table";
import React, { createContext, useContext, useState } from "react";

// ---------- TYPES ----------

interface ProviderProps {
  children: React.ReactNode;
  idDestino?: string;
  tab?: string | string[];
}

const PlaneamentoContext = createContext<PlaneamentoContextType | undefined>(
  undefined
);

// ---------- HELPER FUNCTIONS ----------

const normalizeTabParam = (tab?: string | string[]): TabKey => {
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  const validTabs: TabKey[] = ["op", "orc", "livre"];
  return validTabs.includes(tabValue as TabKey)
    ? (tabValue as TabKey)
    : DEFAULT_TAB;
};

// ---------- PROVIDER ----------

const ContextProviderNovoPlaneamento: React.FC<ProviderProps> = ({
  children,
  idDestino = "",
  tab,
}) => {
  const [posting, setPosting] = useState(false);
  const [idDestinoParaPost, setIdDestinoParaPost] = useState(idDestino);

  // OP State
  const [maisQueUmaOP, setMaisQueUmaOp] = useState(false);
  const [ops, setOps] = useState<PostPorOp[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [opsForSchema, setOpsForSchema] = useState<PostPorOp[]>([]);

  const tabParam = normalizeTabParam(tab);

  const titulo = MENUS_DISPONIVEIS.find(
    (menu) => menu.chave === tabParam
  )?.desc;

  const state: PlaneamentoState = (() => {
    switch (tabParam) {
      case "op":
        return {
          op: {
            maisQueUmaOP,
            setMaisQueUmaOp,
            ops,
            setOps,
            rowSelection,
            setRowSelection,
            opsForSchema,
            setOpsForSchema,
          },
        };
      case "orc":
        return { orc: {} };
      case "livre":
        return { livre: {} };
      default:
        return {};
    }
  })();

  const contextValue: PlaneamentoContextType = {
    menus: MENUS_DISPONIVEIS,
    titulo,
    idDestino: idDestinoParaPost,
    setIdDestino: setIdDestinoParaPost,
    posting,
    setPosting,
    state,
  };

  return (
    <PlaneamentoContext.Provider value={contextValue}>
      {children}
    </PlaneamentoContext.Provider>
  );
};

// ---------- HOOK ----------

export const usePlaneamentoContext = (): PlaneamentoContextType => {
  const context = useContext(PlaneamentoContext);
  if (!context) {
    throw new Error(
      "usePlaneamentoContext must be used within ContextProviderNovoPlaneamento"
    );
  }
  return context;
};

export default ContextProviderNovoPlaneamento;
export type { PlaneamentoContextType, TabKey, Menu, PostPorOp, OpState };
