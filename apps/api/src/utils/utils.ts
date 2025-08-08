import { server } from "@config/config";

export function parseAPIVersion(version: number) {
  return server.API_URI!.replace("$v", `v${version}`);
}

const Pallet = 4;
const Caixa = 5;
const chão = 6;
const Volumes = 7;
export const permiteSubcontainer = {
  1: [Pallet, Caixa, chão],
  2: [Pallet, Caixa, chão],
  3: [Pallet, chão],
  4: [Caixa, Volumes],
  6: [Pallet, Caixa],
};

/**
 * Safely parse JSON, falling back to an empty array.
 */
export const safeParseJson = (value: unknown) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};
