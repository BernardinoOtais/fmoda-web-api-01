import {
  Move3D,
  PlaneIcon,
  Settings,
  Truck,
  Anvil,
  OctagonX,
  GitPullRequestCreate,
  Cog,
  Bug,
  ChessQueen,
} from "lucide-react";

type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

export type LoggedUser = {
  id: string;
  name: string;
  email: string;
};

export type Menu = {
  nome: string;
  path: string;
  icon?: IconType;
  subMenu: boolean;
  isActive?: boolean;
  subMenuItems?: Menu[];
};

export type MenusTodos = {
  loggedUser?: LoggedUser;
  Qualidade: Menu;
  Planeamento: Menu;
  Modelistas: Menu;
  Embarques: Menu;
  Administrador: Menu;
  Rfid: Menu;
  Cp: Menu;
  Joana: Menu;
  Fernanda: Menu;
};

export const IconsMenus = {
  Qualidade: Settings,
  Planeamento: PlaneIcon,
  Modelistas: Move3D,
  Embarques: Truck,
  Administrador: Anvil,
  Rfid: OctagonX,
  Cp: Cog,
  joana: Bug,
  fernanda: ChessQueen,
};

export const MenusExistentes: MenusTodos = {
  Qualidade: {
    nome: "Qualidade",
    path: "/dashboard/qualidade",
    icon: IconsMenus.Qualidade,
    subMenu: true,
    subMenuItems: [
      {
        nome: "Balanço M.",
        path: "/dashboard/qualidade/balancom",
        subMenu: false,
      },
      {
        nome: "Tc...",
        path: "/dashboard/qualidade/tc",
        subMenu: false,
      },
    ],
  },
  Planeamento: {
    nome: "Planeamento",
    path: "/dashboard/planeamento",
    icon: IconsMenus.Planeamento,
    subMenu: true,
    subMenuItems: [
      {
        nome: "N. Planeamento",
        path: "/dashboard/planeamento?novo=true",
        icon: PlaneIcon,
        subMenu: false,
      },
      {
        nome: "Fornecedores",
        path: "/dashboard/planeamento/fornecedores",
        icon: PlaneIcon,
        subMenu: false,
      },
      {
        nome: "Op's Datas",
        path: "/dashboard/planeamento/opdatas",
        icon: PlaneIcon,
        subMenu: false,
      },
      {
        nome: "Imp. PDF",
        path: "/dashboard/planeamento/pdf",
        icon: GitPullRequestCreate,
        subMenu: false,
      },
    ],
  },
  Modelistas: {
    nome: "Modelistas",
    path: "/dashboard/modelistas",
    icon: IconsMenus.Modelistas,
    subMenu: false,
  },
  Embarques: {
    nome: "Embarques",
    path: "/dashboard/embarques",
    icon: IconsMenus.Embarques,
    subMenu: true,
    subMenuItems: [
      {
        nome: "N. Embarque",
        path: "/dashboard/embarques/novo",
        icon: PlaneIcon,
        subMenu: false,
      },
      {
        nome: "Configurações",
        path: "/dashboard/embarques/configurar",
        icon: PlaneIcon,
        subMenu: false,
      },
    ],
  },
  Administrador: {
    nome: "Administrador",
    path: "/dashboard/administrador",
    icon: IconsMenus.Administrador,
    subMenu: false,
  },
  Rfid: {
    nome: "Rfid",
    path: "/dashboard/rfid",
    icon: IconsMenus.Rfid,
    subMenu: false,
  },
  Cp: {
    nome: "Contrôleurs de Production",
    path: "/dashboard/cp",
    icon: IconsMenus.Cp,
    subMenu: false,
  },
  Joana: {
    nome: "Joana",
    path: "/dashboard/joana",
    icon: IconsMenus.joana,
    subMenu: true,
    subMenuItems: [
      {
        nome: "Corte por Op",
        path: "/dashboard/joana/CortePorOp",
        subMenu: false,
      },
      {
        nome: "Entradas MC MA",
        path: "/dashboard/joana/EnMCMA",
        subMenu: false,
      },
      {
        nome: "Envíos a Marrocos",
        path: "/dashboard/joana/EnvMarrocos",
        subMenu: false,
      },
      {
        nome: "Estamparia e Bordados",
        path: "/dashboard/joana/EstEBord",
        subMenu: false,
      },

      {
        nome: "Faturação",
        path: "/dashboard/joana/faturas",
        subMenu: false,
      },
      {
        nome: "Faturação Planeada",
        path: "/dashboard/joana/faturasPlan",
        subMenu: false,
      },
    ],
  },
  Fernanda: {
    nome: "Fernanda",
    path: "/dashboard/fernanda",
    icon: IconsMenus.fernanda,
    subMenu: false,
  },
};
