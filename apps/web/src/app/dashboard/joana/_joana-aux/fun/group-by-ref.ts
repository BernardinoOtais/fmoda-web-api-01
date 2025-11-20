import { PartesDto } from "@repo/tipos/joana/corteporop";

export const groupByCortado = (partes: PartesDto) => {
  const groups: Record<
    string,
    {
      ref: string;
      design: string;
      cortado: { tam: string; ordem: number; qtt: number }[];
    }[]
  > = {};

  for (const p of partes) {
    // Always use a defined array
    const cortadoArr = p.cortado ?? [];

    const key = JSON.stringify(
      [...cortadoArr].sort((a, b) => a.ordem - b.ordem)
    );

    if (!groups[key]) groups[key] = [];

    groups[key].push({
      ...p,
      cortado: cortadoArr,
    });
  }

  return Object.values(groups).map((group) => ({
    designs: group.map((g) => g.design),
    cortado: group[0]?.cortado,
  }));
};
