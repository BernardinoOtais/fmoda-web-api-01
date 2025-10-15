export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str; // Return the empty string if it's empty
  return str[0]?.toUpperCase() + str.slice(1);
}

export function validadoValorNumeroItensPorPagina(
  valor: string | string[] | undefined
) {
  //devolve 10,20,30,40,50,60,70,80,90,100
  const valorNumeroItensPorPagina = valor ? parseInt(valor as string) : 10;

  const validadoValorNumeroItensPorPagina =
    valorNumeroItensPorPagina % 10 === 0 &&
    valorNumeroItensPorPagina >= 10 &&
    valorNumeroItensPorPagina <= 100
      ? valorNumeroItensPorPagina
      : 10;
  return validadoValorNumeroItensPorPagina;
}

export const parsePositiveInt = (str: string): number | false => {
  const trimmed = str.trim();
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    return num > 0 ? num : false;
  }
  return false;
};

export function formatNCasasDecimais(number: number, nCasas: number) {
  return new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: nCasas,
    maximumFractionDigits: nCasas,
  }).format(number);
}

export const isParsableNumber = (value: string): boolean => {
  if (typeof value !== "string") return false;

  const normalized = value.replace(",", ".").trim();
  return normalized !== "" && !isNaN(Number(normalized));
};

export const parseDate = (value: string): Date | undefined => {
  const parts = value.split("/");
  if (parts.length !== 3) return undefined;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? undefined : date;
};
