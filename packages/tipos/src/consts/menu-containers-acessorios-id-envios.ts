import {
  Rows4,
  Scissors,
  Tags,
  LayoutDashboard,
  PackageOpen,
  TableOfContents,
} from "lucide-react";

type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

export type Container = {
  nome: string;
  toolTip: string;
  icon: IconType;
  nivel: number;
  idTipoContainer: number;
  subContainer: Container[];
};

export type TodosOsContainers = {
  Malhas: Container;
  Cortes: Container;
  Acessórios: Container;
};

export const ContainersExistentes: TodosOsContainers = {
  Malhas: {
    nome: "Malhas",
    toolTip: "Malhas",
    icon: Rows4,
    nivel: 0,
    idTipoContainer: 1,
    subContainer: [
      {
        nome: "Pallet",
        toolTip: "Pallet",
        icon: LayoutDashboard,
        nivel: 1,
        idTipoContainer: 4,
        subContainer: [
          {
            nome: "Caixa",
            toolTip: "Caixa",
            icon: PackageOpen,
            nivel: 2,
            idTipoContainer: 5,
            subContainer: [],
          },
        ],
      },
    ],
  },
  Cortes: {
    nome: "Cortes",
    toolTip: "Cortes",
    icon: Scissors,
    nivel: 0,
    idTipoContainer: 2,
    subContainer: [
      {
        nome: "Pallet",
        toolTip: "Pallet",
        icon: LayoutDashboard,
        nivel: 1,
        idTipoContainer: 4,
        subContainer: [
          {
            nome: "Caixa",
            toolTip: "Caixa",
            icon: PackageOpen,
            nivel: 2,
            idTipoContainer: 5,
            subContainer: [],
          },
        ],
      },
    ],
  },
  Acessórios: {
    nome: "Acessórios",
    toolTip: "Acessórios",
    icon: Tags,
    nivel: 0,
    idTipoContainer: 3,
    subContainer: [
      {
        nome: "Pallet",
        toolTip: "Pallet",
        icon: LayoutDashboard,
        nivel: 1,
        idTipoContainer: 4,
        subContainer: [
          {
            nome: "Caixa",
            toolTip: "Caixa",
            icon: PackageOpen,
            nivel: 2,
            idTipoContainer: 5,
            subContainer: [],
          },
          {
            nome: "Volumes",
            toolTip: "Volumes",
            icon: TableOfContents,
            nivel: 2,
            idTipoContainer: 7,
            subContainer: [],
          },
        ],
      },
    ],
  },
};
