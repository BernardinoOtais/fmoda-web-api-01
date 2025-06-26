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
