const BASE = process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || "https://studio.genlayer.com";

export function txExplorerUrl(hash: string): string {
  if (!hash) return "";
  return `${BASE}/tx/${hash}`;
}

export function contractExplorerUrl(address: string): string {
  if (!address) return "";
  return `${BASE}/address/${address}`;
}

export function shortHash(hash: string, chars = 6): string {
  if (!hash) return "";
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortAddress(addr: string): string {
  return shortHash(addr, 4);
}
