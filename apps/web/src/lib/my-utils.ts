export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str; // Return the empty string if it's empty
  return str[0]?.toUpperCase() + str.slice(1);
}
